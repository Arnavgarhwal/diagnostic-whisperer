import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Plus, Minus, X, Upload, FileText, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { medicines, medicineCategories } from "@/data/mockData";
import { useCart } from "@/hooks/useCart";
import { toast } from "@/hooks/use-toast";

const Medicines = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCart, setShowCart] = useState(false);
  const [prescriptionUploaded, setPrescriptionUploaded] = useState(false);
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  const filteredMedicines = medicines.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || med.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (medicine: typeof medicines[0]) => {
    if (medicine.prescription && !prescriptionUploaded) {
      toast({
        title: "Prescription Required",
        description: "Please upload a valid prescription to order this medicine.",
        variant: "destructive"
      });
      return;
    }
    addToCart({
      id: medicine.id,
      name: medicine.name,
      price: medicine.price,
      image: medicine.image
    });
    toast({
      title: "Added to Cart",
      description: `${medicine.name} has been added to your cart.`
    });
  };

  const handleUploadPrescription = () => {
    setPrescriptionUploaded(true);
    toast({
      title: "Prescription Uploaded",
      description: "Your prescription has been verified. You can now order prescription medicines."
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-health-coral/10 text-health-coral border-health-coral/20">
              <ShoppingCart className="w-3 h-3 mr-1" />
              Online Pharmacy
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Order <span className="text-gradient">Medicines</span> Online
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get genuine medicines delivered to your doorstep. Upload prescription for Rx medicines.
            </p>
          </motion.div>

          {/* Prescription Upload Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-4xl mx-auto mb-8 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-health-coral/10 border border-primary/20"
          >
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Upload Prescription</h3>
                  {prescriptionUploaded && (
                    <Badge className="bg-green-500">
                      <Check className="w-3 h-3 mr-1" /> Verified
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm">
                  Upload a valid prescription to order prescription-only medicines.
                </p>
              </div>
              <Button 
                variant={prescriptionUploaded ? "outline" : "hero"}
                onClick={handleUploadPrescription}
              >
                <Upload className="w-4 h-4 mr-2" />
                {prescriptionUploaded ? "Replace Prescription" : "Upload Now"}
              </Button>
            </div>
          </motion.div>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search medicines..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Button 
                variant="outline" 
                className="relative"
                onClick={() => setShowCart(true)}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Cart
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-health-coral text-white text-xs rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {medicineCategories.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className={selectedCategory === cat ? "bg-primary" : ""}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Medicine Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedicines.map((medicine, index) => (
              <motion.div
                key={medicine.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{medicine.image}</div>
                  {medicine.prescription && (
                    <Badge variant="destructive" className="text-xs">Rx</Badge>
                  )}
                </div>
                <Badge variant="secondary" className="mb-2">{medicine.category}</Badge>
                <h3 className="font-semibold text-lg mb-1">{medicine.name}</h3>
                <p className="text-muted-foreground text-sm mb-2">{medicine.description}</p>
                <p className="text-xs text-muted-foreground mb-4">Dosage: {medicine.dosage}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">₹{(medicine.price * 83).toFixed(0)}</span>
                  <Button
                    size="sm"
                    variant={medicine.inStock ? "hero" : "outline"}
                    disabled={!medicine.inStock}
                    onClick={() => handleAddToCart(medicine)}
                  >
                    {medicine.inStock ? (
                      <>
                        <Plus className="w-4 h-4 mr-1" /> Add
                      </>
                    ) : (
                      "Out of Stock"
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowCart(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-border z-50 flex flex-col"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-xl font-bold">Your Cart ({totalItems})</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowCart(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center gap-4 p-4 bg-accent/30 rounded-xl">
                        <div className="text-3xl">{item.image}</div>
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-primary font-semibold">₹{(item.price * 83).toFixed(0)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="icon" 
                            variant="outline" 
                            className="w-8 h-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button 
                            size="icon" 
                            variant="outline" 
                            className="w-8 h-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <Button 
                          size="icon" 
                          variant="ghost"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-border space-y-4">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary">₹{(totalPrice * 83).toFixed(0)}</span>
                  </div>
                  <Button variant="hero" className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                  <a 
                    href="https://www.1mg.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="outline" className="w-full">
                      Buy from 1mg Pharmacy
                    </Button>
                  </a>
                  <a 
                    href="https://www.apollopharmacy.in" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="outline" className="w-full">
                      Buy from Apollo Pharmacy
                    </Button>
                  </a>
                  <Button variant="ghost" className="w-full" onClick={clearCart}>
                    Clear Cart
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Medicines;
