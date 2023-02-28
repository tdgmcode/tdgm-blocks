
let toolData = {
    run: ({ innerGroup, doc }) => {
        var data = new Blob(['<svg>' + innerGroup.exportSVG({asString: true}) + '</svg>'], {type: 'image/svg'});

        var url = window.URL.createObjectURL(data);

        doc.download.href = url;
        doc.download.click();
    }
}

export { toolData };