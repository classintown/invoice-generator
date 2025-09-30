import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { InvoiceHeader } from "@/components/InvoiceHeader";
import { InvoiceDetails } from "@/components/InvoiceDetails";
import { InvoiceTable } from "@/components/InvoiceTable";
import { InvoiceFooter } from "@/components/InvoiceFooter";
import { Printer, Download, Edit } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "INV-001",
    date: "",
    from: {
      name: "Rajesh Kumar Sharma",
      address: "123 MG Road, Koramangala, Bangalore 560034",
      email: "rajesh.sharma@email.com",
      pan: "ABCDE1234F",
    },
    billTo: {
      name: "CIT Ventures Pvt Ltd",
      address: "V12 Sacred Heart Town Pune 411040",
    },
    paymentMode: "By Bank transfer",
    items: [
      {
        description: "Software Development Services",
        amount: 10000.0,
      },
    ],
    bankDetails: {
      accountNumber: "123456789012",
      ifscCode: "HDFC0001234",
      bankName: "HDFC Bank",
      branch: "Koramangala Branch",
    },
    amountInWords: "Rupees Ten thousand only",
    signature: "Rajesh Kumar Sharma",
    signatureImage: null,
  });

  // Function to convert number to Indian words
  const numberToIndianWords = (num: number): string => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    
    if (num === 0) return 'Zero';
    
    const convertHundreds = (n: number): string => {
      let result = '';
      if (n > 99) {
        result += ones[Math.floor(n / 100)] + ' Hundred';
        n %= 100;
        if (n > 0) result += ' ';
      }
      if (n > 19) {
        result += tens[Math.floor(n / 10)];
        n %= 10;
        if (n > 0) result += ' ' + ones[n];
      } else if (n > 9) {
        result += teens[n - 10];
      } else if (n > 0) {
        result += ones[n];
      }
      return result;
    };
    
    let result = '';
    if (num >= 10000000) {
      result += convertHundreds(Math.floor(num / 10000000)) + ' Crore';
      num %= 10000000;
      if (num > 0) result += ' ';
    }
    if (num >= 100000) {
      result += convertHundreds(Math.floor(num / 100000)) + ' Lakh';
      num %= 100000;
      if (num > 0) result += ' ';
    }
    if (num >= 1000) {
      result += convertHundreds(Math.floor(num / 1000)) + ' Thousand';
      num %= 1000;
      if (num > 0) result += ' ';
    }
    if (num > 0) {
      result += convertHundreds(num);
    }
    
    return result + ' only';
  };

  useEffect(() => {
    const savedData = localStorage.getItem("invoiceData");
    if (savedData) {
      const data = JSON.parse(savedData);
      // Calculate amount in words if not present
      if (!data.amountInWords) {
        const total = data.items?.reduce((sum: number, item: any) => sum + (item.amount || 0), 0) || 0;
        data.amountInWords = `Rupees ${numberToIndianWords(total)}`;
      }
      setInvoiceData(data);
    } else {
      // Set default date for new users
      const today = new Date();
      const formattedDate = today.toLocaleDateString('en-GB').replace(/\//g, '.');
      setInvoiceData(prev => ({
        ...prev,
        date: formattedDate
      }));
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Action Buttons - Hidden on Print */}
        <div className="flex justify-end gap-3 mb-8 print:hidden">
          <Button variant="outline" size="sm" onClick={() => navigate("/create")} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button size="sm" onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>

        {/* Invoice Container */}
        <div className="bg-card border border-border shadow-sm rounded-lg p-12 print:shadow-none print:border-0 print:p-6 print:text-sm print:space-y-4">
          <InvoiceHeader
            invoiceNumber={invoiceData.invoiceNumber}
            date={invoiceData.date}
            from={invoiceData.from}
          />

          <InvoiceDetails billTo={invoiceData.billTo} paymentMode={invoiceData.paymentMode} />

          <InvoiceTable items={invoiceData.items} />

          <InvoiceFooter
            bankDetails={invoiceData.bankDetails}
            amountInWords={invoiceData.amountInWords}
            signature={invoiceData.signature}
            signatureImage={invoiceData.signatureImage}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
