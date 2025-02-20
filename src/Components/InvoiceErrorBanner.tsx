type InvoiceErrorBannerProps = {
  generateInvoice: (value: boolean) => void;
};

const InvoiceErrorBanner: React.FC<InvoiceErrorBannerProps> = ({
  generateInvoice,
}) => {
  return (
    <div className="flex items-center max-md:flex-col gap-6 bg-slate-700 text-white px-6 py-3.5 rounded font-[sans-serif]">
      <p className="text-base flex-1 max-md:text-center">
        You are creating an invoice with shifts that have already been invoiced
      </p>
      <div>
        <button
          type="button"
          className="bg-white text-blue-500 py-2.5 px-5 rounded text-sm"
          onClick={() => generateInvoice(true)}
        >
          Include these shifts
        </button>
        <button
          type="button"
          className="bg-white text-blue-500 py-2.5 px-5 m-5 rounded text-sm"
          onClick={() => generateInvoice(false)}
        >
          Do not include already invoiced shifts
        </button>
      </div>
    </div>
  );
};

export default InvoiceErrorBanner;
