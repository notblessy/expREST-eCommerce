const { InvoiceNumber } = require('invoice-number');

const generateInvoice = (latestOrder) => {
  const today = new Date();
  const day = `${today.getDate()}`.padStart(2, '0');
  const month = `${today.getMonth() + 1}`.padStart(2, '0');

  let invoiceNumber = 'INV' + today.getFullYear() + month + day + '/0000001';
  if (latestOrder) {
    const currentNumber = latestOrder.invoice_no.split('/')[1];
    const nextNumber = InvoiceNumber.next(currentNumber);

    invoiceNumber =
      'INV' + today.getFullYear() + month + day + '/' + nextNumber;
  }

  return invoiceNumber;
};

module.exports = generateInvoice;
