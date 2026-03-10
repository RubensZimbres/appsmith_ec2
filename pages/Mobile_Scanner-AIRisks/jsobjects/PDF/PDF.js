export default {
    generateAllTables: () => {
        try {
            if (typeof jspdf === 'undefined') {
                throw new Error("jsPDF library is not loaded.");
            }

            const doc = new jspdf.jsPDF();
            let currentY = 20;

            // --- HEADER ---
            doc.setFontSize(18);
            doc.text("Dashboard Report", 14, currentY);
            currentY += 10;
            doc.setFontSize(10);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 14, currentY);
            currentY += 15;

            // --- TRANSFORMERS ---
            const transformCookies = (data) => {
                if (!data || !Array.isArray(data)) return [];
                return data.map(cookie => ({
                    "Name": cookie.name || 'unknown',
                    "Domain": cookie.domain || '-',
                    "Type": cookie.thirdParty ? 'External' : 'Internal',
                    "Risk": cookie.thirdParty ? "High Egress" : (!cookie.httpOnly ? "JS Exposure" : "Safe"),
                    "Protection": (cookie.httpOnly && cookie.secure) ? "Robust" : "Vulnerable",
                    "Disclosed": (cookie.purpose && cookie.purpose !== "-") ? "YES" : "NO"
                }));
            };

            const transformNetwork = (data) => {
                const arr = Array.isArray(data) ? data : (data ? [data] : []);
                return arr.slice(0, 100).map(item => ({
                    "Method": item.method || "-",
                    "URL": (item.url || "").substring(0, 40), 
                    "Params": item.params ? JSON.stringify(item.params).substring(0, 150) : "-"
                }));
            };

            // --- PRINT HELPER (The Fix) ---
            const printTable = (title, data) => {
                if (!data || data.length === 0) return;

                // Check if we need a new page BEFORE printing the title
                if (currentY > 240) { 
                    doc.addPage();
                    currentY = 20;
                }

                doc.setFontSize(14);
                doc.setTextColor(40);
                doc.text(title, 14, currentY);

                doc.autoTable({
                    startY: currentY + 5,
                    head: [Object.keys(data[0])],
                    body: data.map(obj => Object.values(obj)),
                    theme: 'striped',
                    styles: { 
                        fontSize: 7, 
                        overflow: 'linebreak',
                        cellPadding: 2 
                    },
                    columnStyles: {
                        // Force wrap/truncate specific columns to prevent horizontal overflow
                        0: { cellWidth: 30 }, 
                        1: { cellWidth: 50 },
                        2: { cellWidth: 'auto' }
                    },
                    margin: { left: 14, right: 14 },
                    didDrawPage: (data) => {
                        // Header or footer can go here
                    }
                });

                // Crucial: Update currentY for the next table
                currentY = doc.lastAutoTable.finalY + 15;
            };

            // --- EXECUTION ---
            const cookieData = transformCookies(MobileScanner.model.cookies);
            printTable("Web Scanner Cookies", cookieData);

            const netData = transformNetwork(MobileScannerNetworkTraffic.model.networkData);
            printTable("Network Traffic", netData);

            const c1Data = transformNetwork(Custom1.model.networkEvents); // Reusing net transform for params logic
            printTable("Custom Data 1", c1Data);

            // --- DOWNLOAD ---
            const pdfData = doc.output('datauristring');
            download(pdfData, "Dashboard_Report.pdf");
            showAlert("PDF Generated Successfully", "success");

        } catch (error) {
            console.error(error);
            showAlert("Error: " + error.message, "error");
        }
    }
}