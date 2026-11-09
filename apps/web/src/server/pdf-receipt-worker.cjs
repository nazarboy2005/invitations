// Untrusted PDF parsing stays outside the request's JS heap/event loop.
const { parentPort, workerData } = require("node:worker_threads");
const {
  PDFDocument,
  PDFName,
  PDFDict,
  PDFStream,
  PDFArray,
} = require("pdf-lib");
(async () => {
  try {
    const source = await PDFDocument.load(workerData, {
      throwOnInvalidObject: true,
      updateMetadata: false,
    });
    if (
      source.getPageCount() < 1 ||
      source.getPageCount() > 50 ||
      source.context.enumerateIndirectObjects().length > 20000
    )
      throw new Error("Invalid PDF");
    source.getForm().flatten({ updateFieldAppearances: false });
    for (const page of source.getPages())
      for (const key of ["Annots", "AA", "A", "PresSteps", "Metadata", "AF"])
        page.node.delete(PDFName.of(key));
    const clean = await PDFDocument.create();
    for (const page of await clean.copyPages(source, source.getPageIndices()))
      clean.addPage(page);
    const pending = clean.context
      .enumerateIndirectObjects()
      .map(([, object]) => object);
    const seen = new Set();
    while (pending.length) {
      const object = pending.pop();
      if (seen.has(object)) continue;
      seen.add(object);
      if (seen.size > 100000) throw new Error("Invalid PDF");
      if (object instanceof PDFArray) pending.push(...object.asArray());
      const dict =
        object instanceof PDFDict
          ? object
          : object instanceof PDFStream
            ? object.dict
            : null;
      if (!dict) continue;
      for (const key of [
        "A",
        "AA",
        "JS",
        "JavaScript",
        "OpenAction",
        "RichMediaContent",
        "RichMediaSettings",
        "EmbeddedFiles",
        "EF",
        "AF",
        "XFA",
      ])
        dict.delete(PDFName.of(key));
      pending.push(...dict.values());
    }
    const content = await clean.save();
    if (content.length > 5 * 1024 * 1024) throw new Error("Invalid PDF");
    parentPort.postMessage({ content });
  } catch {
    parentPort.postMessage({ invalid: true });
  }
})();
