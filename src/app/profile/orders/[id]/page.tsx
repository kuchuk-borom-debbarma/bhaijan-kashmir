import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { ShipmentFactory } from "@/lib/shipment/factory";
import { Package, Truck, CheckCircle, Clock, MapPin, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/auth/sign-in");

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id: id },
    include: {
      items: { include: { product: true } },
      shipment: {
        include: {
          events: { orderBy: { timestamp: "desc" } }
        }
      }
    }
  });

  if (!order || order.userId !== session.user.id) {
    notFound();
  }

  let trackingResult = null;
  // Use Resolver only if we don't have enough info, OR to augment
  // Logic: If provider is "Manual", use only DB events.
  // If provider is "BlueDart", maybe fetch API.
  // For now, let's prioritize API if available, but show DB events as "Updates".
  if (order.shipment) {
    const resolver = ShipmentFactory.getResolver(order.shipment.provider);
    trackingResult = await resolver.resolve({
      provider: order.shipment.provider,
      trackingNumber: order.shipment.trackingNumber
    });
  }

  const getStatusStep = (currentStatus: string) => {
    const steps = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED'];
    return steps.indexOf(currentStatus);
  };

  const currentStep = getStatusStep(order.status);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/profile/orders" className="inline-flex items-center text-stone-500 hover:text-walnut mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-walnut">Order #{order.id.slice(-8)}</h1>
          <p className="text-stone-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="px-4 py-2 bg-stone-100 rounded-full font-bold text-walnut border border-stone-200">
          Total: ₹{Number(order.total).toLocaleString()}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-100 mb-8">
        <div className="relative flex justify-between">
          {['Order Placed', 'Payment Confirmed', 'Shipped', 'Delivered'].map((step, index) => {
            const isCompleted = index <= currentStep;
            
            return (
              <div key={step} className="flex flex-col items-center relative z-10 w-1/4">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-500
                    ${isCompleted ? 'bg-kashmir-green border-kashmir-green text-white' : 'bg-white border-stone-200 text-stone-300'}
                  `}
                >
                  {index === 0 && <Clock className="w-5 h-5" />}
                  {index === 1 && <CheckCircle className="w-5 h-5" />}
                  {index === 2 && <Truck className="w-5 h-5" />}
                  {index === 3 && <Package className="w-5 h-5" />}
                </div>
                <p className={`mt-2 text-xs md:text-sm font-medium text-center ${isCompleted ? 'text-walnut' : 'text-stone-400'}`}>
                  {step}
                </p>
              </div>
            );
          })}
          
          {/* Connecting Line */}
          <div className="absolute top-5 left-0 w-full h-0.5 bg-stone-200 -z-0 transform scale-x-[0.85] origin-center" />
          <div 
            className="absolute top-5 left-0 h-0.5 bg-kashmir-green -z-0 transition-all duration-500 origin-left transform scale-x-[0.85]" 
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Shipment & Tracking */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Shipment Details Card */}
          {order.shipment ? (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
              <h2 className="text-xl font-bold text-walnut mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5" /> Shipment Details
              </h2>
              
              <div className="bg-stone-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-stone-500">Courier Partner</p>
                    <p className="font-bold text-walnut">{order.shipment.provider}</p>
                  </div>
                  <div>
                    <p className="text-stone-500">Tracking Number</p>
                    <p className="font-mono font-bold text-walnut">{order.shipment.trackingNumber}</p>
                  </div>
                </div>
              </div>

              {/* Resolver Result */}
              {trackingResult && (
                <div className="border-t border-stone-100 pt-4">
                  <h3 className="font-bold text-walnut mb-3">Tracking Status</h3>
                  <div className="space-y-3">
                    <p className="text-stone-700">{trackingResult.message}</p>
                    {trackingResult.location && (
                       <p className="flex items-center text-sm text-stone-500">
                         <MapPin className="w-4 h-4 mr-1" /> {trackingResult.location}
                       </p>
                    )}
                    {trackingResult.trackingUrl && (
                      <a 
                        href={trackingResult.trackingUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-kashmir-red font-bold hover:underline mt-2"
                      >
                        Track on {order.shipment.provider} <ExternalLink className="w-4 h-4 ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Manual Events History */}
              {order.shipment.events && order.shipment.events.length > 0 && (
                <div className="border-t border-stone-100 pt-6 mt-6">
                   <h3 className="font-bold text-walnut mb-4">Shipment Progress</h3>
                   <div className="space-y-6 border-l-2 border-stone-200 ml-2 pb-2">
                      {order.shipment.events.map((event) => (
                        <div key={event.id} className="relative pl-6">
                           <div className="absolute -left-[7px] top-1.5 w-3 h-3 bg-stone-300 rounded-full border-2 border-white"></div>
                           <div>
                              <p className="font-bold text-sm text-walnut">{event.status}</p>
                              <p className="text-xs text-stone-500">{new Date(event.timestamp).toLocaleString()}</p>
                              <p className="text-sm text-stone-600 mt-1">
                                {event.location && <span className="font-medium mr-1">{event.location}:</span>}
                                {event.description}
                              </p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}
            </div>
          ) : (
             <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex items-center justify-center min-h-[200px] text-stone-500">
               <div className="text-center">
                 <Package className="w-12 h-12 mx-auto mb-2 opacity-20" />
                 <p>Shipment details will appear here once your order is dispatched.</p>
               </div>
             </div>
          )}

          {/* Items List */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
             <h2 className="text-xl font-bold text-walnut mb-4">Order Items</h2>
             <div className="divide-y divide-stone-100">
               {order.items.map((item) => (
                 <div key={item.id} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                   <div className="w-16 h-16 bg-stone-100 rounded-md overflow-hidden relative">
                     {/* Replace with real Image component when available */}
                     <div className="absolute inset-0 flex items-center justify-center text-xs text-stone-400 bg-stone-200">IMG</div>
                   </div>
                   <div className="flex-grow">
                     <p className="font-bold text-walnut">{item.product.name}</p>
                     <p className="text-sm text-stone-500">Qty: {item.quantity} × ₹{Number(item.price)}</p>
                   </div>
                   <div className="font-bold text-walnut">
                     ₹{(Number(item.price) * item.quantity).toLocaleString()}
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Right Column: Address & Summary */}
        <div className="space-y-8">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
              <h2 className="text-lg font-bold text-walnut mb-4">Shipping Address</h2>
              <p className="text-stone-600 whitespace-pre-wrap leading-relaxed">{order.shippingAddress}</p>
           </div>
           
           <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
              <h2 className="text-lg font-bold text-walnut mb-4">Payment Info</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">Status</span>
                  <span className={`font-bold ${order.status === 'PAID' || order.status === 'SHIPPED' || order.status === 'DELIVERED' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {order.status === 'PENDING' ? 'Unpaid' : 'Paid'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Method</span>
                  <span className="font-medium capitalize">{order.paymentProvider}</span>
                </div>
                {order.paymentId && (
                    <div className="flex justify-between">
                    <span className="text-stone-500">Transaction ID</span>
                    <span className="font-mono text-xs">{order.paymentId.slice(0, 10)}...</span>
                    </div>
                )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
