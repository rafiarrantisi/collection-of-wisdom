"""PDF QA for A Collection of Wisdom.

Renders every page, builds a contact sheet, checks geometry (A5), fonts,
text safe-area, block collisions, link targets and decodes every QR code.
Writes qa/pdf_qc.json, qa/contact_sheet.png and qa/pages/*.png.
Exit code 1 when a blocking issue is found.
"""
import json
import sys
from pathlib import Path

import cv2
import fitz  # PyMuPDF
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PDF = ROOT / "A_Collection_of_Wisdom.pdf"
QA = ROOT / "qa"
PAGES = QA / "pages"
CATALOG = json.loads((ROOT / "content" / "video-catalog.json").read_text(encoding="utf8"))
EXPECTED_URLS = {v["url"] for v in CATALOG["videos"]}
MM = 72 / 25.4
A5 = (148 * MM, 210 * MM)
SAFE_MM = 9.0  # minimum text clearance from trim (folio/run-head zone included)
DPI = 180


def rects_overlap(a, b, pad=0.5):
    return not (a[2] <= b[0] + pad or b[2] <= a[0] + pad or a[3] <= b[1] + pad or b[3] <= a[1] + pad)


def lines_collide(a, b) -> bool:
    """True when two text lines genuinely overprint (not just ascender/descender boxes touching)."""
    dx = min(a[2], b[2]) - max(a[0], b[0])
    dy = min(a[3], b[3]) - max(a[1], b[1])
    smaller = min(a[3] - a[1], b[3] - b[1])
    return dx > 2 and dy > 0.35 * smaller


def main() -> int:
    QA.mkdir(exist_ok=True)
    PAGES.mkdir(exist_ok=True)
    doc = fitz.open(PDF)
    report = {
        "file": PDF.name,
        "bytes": PDF.stat().st_size,
        "encrypted": doc.is_encrypted,
        "page_count": doc.page_count,
        "pages": [],
        "fonts": [],
        "links": [],
        "qr": [],
        "blocking": [],
        "warnings": [],
    }
    if doc.page_count % 4:
        report["blocking"].append(f"page count {doc.page_count} is not a multiple of 4")

    fonts = set()
    thumbs = []
    for pno, page in enumerate(doc, start=1):
        info = {"page": pno}
        w, h = page.rect.width, page.rect.height
        info["size_mm"] = [round(w / MM, 2), round(h / MM, 2)]
        if abs(w - A5[0]) > 1 or abs(h - A5[1]) > 1:
            report["blocking"].append(f"p{pno}: size {info['size_mm']} is not A5")

        for f in page.get_fonts(full=True):
            fonts.add((f[3], f[1], f[2]))  # basefont, ext, type

        text = page.get_text("text")
        info["chars"] = len(text)
        if "�" in text or "□" in text:
            report["blocking"].append(f"p{pno}: replacement glyph in extracted text")

        # text spans: safe area + collisions between unrelated blocks
        d = page.get_text("dict")
        blocks = [b for b in d["blocks"] if b["type"] == 0]
        for b in blocks:
            for line in b["lines"]:
                for s in line["spans"]:
                    if not s["text"].strip():
                        continue
                    x0, y0, x1, y1 = s["bbox"]
                    clear = min(x0, y0, w - x1, h - y1) / MM
                    if clear < SAFE_MM:
                        report["blocking"].append(f"p{pno}: span '{s['text'][:30]}' {clear:.1f}mm from trim")
                    if s["size"] < 8.4:
                        report["warnings"].append(f"p{pno}: small text {s['size']:.1f}pt '{s['text'][:30]}'")
        for i in range(len(blocks)):
            for j in range(i + 1, len(blocks)):
                a, b = blocks[i]["bbox"], blocks[j]["bbox"]
                if rects_overlap(a, b, pad=1.0):
                    # same paragraph split into blocks may touch; check line-level overlap
                    la = [l["bbox"] for l in blocks[i]["lines"]]
                    lb = [l["bbox"] for l in blocks[j]["lines"]]
                    if any(lines_collide(x, y) for x in la for y in lb):
                        report["blocking"].append(f"p{pno}: text blocks {i} and {j} overlap")

        # text vs images
        imgs = [page.get_image_bbox(img) for img in page.get_images(full=True)]
        for r in imgs:
            for b in blocks:
                for line in b["lines"]:
                    if rects_overlap(line["bbox"], tuple(r), pad=0.8):
                        report["blocking"].append(f"p{pno}: text overlaps image at {tuple(round(v) for v in r)}")
                        break

        for link in page.get_links():
            uri = link.get("uri")
            if uri:
                report["links"].append({"page": pno, "uri": uri})

        pix = page.get_pixmap(dpi=DPI)
        out = PAGES / f"page-{pno:02d}.png"
        pix.save(out)
        thumbs.append(out)

        # QR decode at high resolution
        hi = page.get_pixmap(dpi=300)
        arr = np.frombuffer(hi.samples, dtype=np.uint8).reshape(hi.height, hi.width, hi.n)
        gray = cv2.cvtColor(arr[:, :, :3], cv2.COLOR_RGB2GRAY)
        ok, decoded, _, _ = cv2.QRCodeDetector().detectAndDecodeMulti(gray)
        if ok:
            for val in decoded:
                if val:
                    report["qr"].append({"page": pno, "decoded": val, "expected": val in EXPECTED_URLS})
        report["pages"].append(info)

    report["fonts"] = sorted({f"{name} ({kind})" for name, _ext, kind in fonts})
    if any("Type3" in f for f in report["fonts"]):
        report["warnings"].append("Type3 font present")

    link_uris = {l["uri"].rstrip("/") for l in report["links"]}
    qr_vals = {q["decoded"] for q in report["qr"]}
    report["video_link_check"] = {u: {"link": u in link_uris, "qr": u in qr_vals} for u in sorted(EXPECTED_URLS)}
    for u, st in report["video_link_check"].items():
        if not st["link"]:
            report["blocking"].append(f"missing clickable link {u}")
        if not st["qr"]:
            report["blocking"].append(f"QR for {u} not decoded")
    stray = [q for q in report["qr"] if not q["expected"]]
    if stray:
        report["blocking"].append(f"unexpected QR payloads: {stray}")

    # contact sheet, 8 per row
    cols = 8
    tw = 260
    ims = [Image.open(p) for p in thumbs]
    th = int(tw * ims[0].height / ims[0].width)
    rows = (len(ims) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * (tw + 16) + 16, rows * (th + 16) + 16), (120, 112, 102))
    for k, im in enumerate(ims):
        im = im.convert("RGB").resize((tw, th), Image.LANCZOS)
        sheet.paste(im, (16 + (k % cols) * (tw + 16), 16 + (k // cols) * (th + 16)))
    sheet.save(QA / "contact_sheet.png")

    (QA / "pdf_qc.json").write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf8")
    print(f"pages={report['page_count']} bytes={report['bytes']} fonts={len(report['fonts'])} "
          f"links={len(report['links'])} qr={len(report['qr'])}")
    for b in report["blocking"]:
        print("BLOCKING:", b)
    for wmsg in report["warnings"][:20]:
        print("warn:", wmsg)
    return 1 if report["blocking"] else 0


if __name__ == "__main__":
    sys.exit(main())
