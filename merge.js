const mergePdfs = async (p1, p2) => {
  const { default: PDFMerger } = await import('pdf-merger-js');  
  const merger = new PDFMerger();
  await merger.add(p1);
  await merger.add(p2);
  await merger.setMetadata({
    producer: "Tirth",
    author: "Tirth",
    creator: "Tirth",
    title: "PDF_Merger(by Tirth)"
  });
  await merger.save(`public/merge.pdf`);
};
module.exports = { mergePdfs }; 
