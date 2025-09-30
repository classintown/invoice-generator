import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InvoiceItem {
  description: string;
  amount: string;
}

const CreateInvoice = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [date, setDate] = useState("");
  
  const [fromName, setFromName] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [fromPan, setFromPan] = useState("");
  
  const [billToName, setBillToName] = useState("CIT Ventures Pvt Ltd");
  const [billToAddress, setBillToAddress] = useState("V12 Sacred Heart Town Pune 411040");
  
  const [paymentMode, setPaymentMode] = useState("By Bank transfer");
  
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "Software Development Services", amount: "10000.00" }
  ]);
  
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [branch, setBranch] = useState("");
  
  const [signature, setSignature] = useState("");
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("invoiceData");
    if (savedData) {
      const data = JSON.parse(savedData);
      setInvoiceNumber(data.invoiceNumber || "");
      setDate(data.date || "");
      setFromName(data.from?.name || "");
      setFromAddress(data.from?.address || "");
      setFromEmail(data.from?.email || "");
      setFromPan(data.from?.pan || "");
      setBillToName(data.billTo?.name || "CIT Ventures Pvt Ltd");
      setBillToAddress(data.billTo?.address || "V12 Sacred Heart Town Pune 411040");
      setPaymentMode(data.paymentMode || "By Bank transfer");
      setItems(data.items?.length > 0 ? data.items.map((item: any) => ({ 
        description: item.description, 
        amount: item.amount.toString() 
      })) : [{ description: "Software Development Services", amount: "10000.00" }]);
      setAccountNumber(data.bankDetails?.accountNumber || "");
      setIfscCode(data.bankDetails?.ifscCode || "");
      setBankName(data.bankDetails?.bankName || "");
      setBranch(data.bankDetails?.branch || "");
      setSignature(data.signature || "");
      setSignaturePreview(data.signatureImage || null);
    } else {
      // Set default values for first time users
      const today = new Date();
      const formattedDate = today.toLocaleDateString('en-GB').replace(/\//g, '.');
      setInvoiceNumber("INV-001");
      setDate(formattedDate);
      setFromName("Rajesh Kumar Sharma");
      setFromAddress("123 MG Road, Koramangala, Bangalore 560034");
      setFromEmail("rajesh.sharma@email.com");
      setFromPan("ABCDE1234F");
      setAccountNumber("123456789012");
      setIfscCode("HDFC0001234");
      setBankName("HDFC Bank");
      setBranch("Koramangala Branch");
      setSignature("Rajesh Kumar Sharma");
    }
  }, []);

  const addItem = () => {
    setItems([...items, { description: "", amount: "" }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSignatureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload an image smaller than 2MB",
          variant: "destructive",
        });
        return;
      }

      setSignatureFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setSignaturePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSignature = () => {
    setSignatureFile(null);
    setSignaturePreview(null);
  };

  const handleSave = () => {
    // Validate required fields
    if (!fromName || !billToName || items.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Save to localStorage
    const total = calculateTotal();
    const invoiceData = {
      invoiceNumber,
      date,
      from: { name: fromName, address: fromAddress, email: fromEmail, pan: fromPan },
      billTo: { name: billToName, address: billToAddress },
      paymentMode,
      items: items.map(item => ({
        description: item.description,
        amount: parseFloat(item.amount) || 0
      })),
      bankDetails: { accountNumber, ifscCode, bankName, branch },
      amountInWords: `Rupees ${numberToIndianWords(total)}`,
      signature,
      signatureImage: signaturePreview,
    };

    localStorage.setItem("invoiceData", JSON.stringify(invoiceData));

    toast({
      title: "Invoice Saved",
      description: "Your invoice has been saved successfully",
    });

    navigate("/");
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  };

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

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Invoice
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Invoice</CardTitle>
            <CardDescription>Fill in all the details to generate your invoice</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Invoice Header Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                <Input
                  id="invoiceNumber"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="1"
                />
              </div>
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="DD.MM.YYYY"
                />
              </div>
            </div>

            {/* From Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">From</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fromName">Name *</Label>
                  <Input
                    id="fromName"
                    value={fromName}
                    onChange={(e) => setFromName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <Label htmlFor="fromEmail">Email *</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={fromEmail}
                    onChange={(e) => setFromEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="fromAddress">Address</Label>
                  <Input
                    id="fromAddress"
                    value={fromAddress}
                    onChange={(e) => setFromAddress(e.target.value)}
                    placeholder="Your address"
                  />
                </div>
                <div>
                  <Label htmlFor="fromPan">PAN Number</Label>
                  <Input
                    id="fromPan"
                    value={fromPan}
                    onChange={(e) => setFromPan(e.target.value)}
                    placeholder="PAN NO."
                  />
                </div>
              </div>
            </div>

            {/* Bill To Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Bill To</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="billToName">Client Name *</Label>
                  <Input
                    id="billToName"
                    value={billToName}
                    onChange={(e) => setBillToName(e.target.value)}
                    placeholder="Client company name"
                  />
                </div>
                <div>
                  <Label htmlFor="billToAddress">Client Address</Label>
                  <Textarea
                    id="billToAddress"
                    value={billToAddress}
                    onChange={(e) => setBillToAddress(e.target.value)}
                    placeholder="Client address"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Payment Mode */}
            <div>
              <Label htmlFor="paymentMode">Payment Mode</Label>
              <Input
                id="paymentMode"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                placeholder="e.g., By Bank transfer"
              />
            </div>

            {/* Items */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Items</h3>
                <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Item
                </Button>
              </div>
              
              {items.map((item, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label htmlFor={`desc-${index}`}>Description *</Label>
                    <Input
                      id={`desc-${index}`}
                      value={item.description}
                      onChange={(e) => updateItem(index, "description", e.target.value)}
                      placeholder="Service description"
                    />
                  </div>
                  <div className="w-40">
                    <Label htmlFor={`amount-${index}`}>Amount (₹) *</Label>
                    <Input
                      id={`amount-${index}`}
                      type="number"
                      step="0.01"
                      value={item.amount}
                      onChange={(e) => updateItem(index, "amount", e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              <div className="flex justify-end pt-4 border-t">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">
                    ₹{calculateTotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Bank Account Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Account number"
                  />
                </div>
                <div>
                  <Label htmlFor="ifscCode">IFSC Code</Label>
                  <Input
                    id="ifscCode"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    placeholder="IFSC code"
                  />
                </div>
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Bank name"
                  />
                </div>
                <div>
                  <Label htmlFor="branch">Branch</Label>
                  <Input
                    id="branch"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="Branch name"
                  />
                </div>
              </div>
            </div>

            {/* Signature */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="signature">Signature Name</Label>
                <Input
                  id="signature"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Your name for signature"
                />
              </div>
              
              <div>
                <Label htmlFor="signatureUpload">Upload Signature Image</Label>
                <div className="space-y-3">
                  <Input
                    id="signatureUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleSignatureUpload}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                  />
                  
                  {signaturePreview && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Signature Preview:</p>
                      <div className="relative inline-block">
                        <img 
                          src={signaturePreview} 
                          alt="Signature Preview" 
                          className="h-16 w-auto border border-border rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={removeSignature}
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button variant="outline" onClick={() => navigate("/")}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save & View Invoice
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateInvoice;
