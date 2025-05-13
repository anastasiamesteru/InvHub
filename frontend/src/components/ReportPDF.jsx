import React from "react";
import { Page, Text, View, Document, StyleSheet, Font, } from "@react-pdf/renderer";

// Register fonts
Font.register({
  family: 'Poppins',
  src: '/fonts/Poppins-Regular.ttf',
  fontStyle: 'normal',
  fontWeight: 400,
  fonts: [
    { src: '/fonts/Poppins-Regular.ttf', fontStyle: 'normal', fontWeight: 'normal' },
    { src: '/fonts/Poppins-SemiBold.ttf', fontStyle: 'normal', fontWeight: '600' },
    { src: '/fonts/Poppins-Medium.ttf', fontStyle: 'normal', fontWeight: '500' },
  ]
});


const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Poppins",
    backgroundColor: "#FFFFFF",
    color: "#000000",
  },
  section: {
    marginBottom: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#000000",
  },
  table: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "solid",
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderBottomStyle: "solid",
    paddingVertical: 2,
    paddingHorizontal: 5,
  },
  cell: {
    flex: 1,
    textAlign: "left",
    fontSize: 12,
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    borderRightStyle: "solid",
    color: "#000000",
    flexWrap: "wrap",
    overflow: "hidden",
    whiteSpace: 'normal', // Make sure text wraps within the cell
  },
  lastCell: {
    borderRightWidth: 0,
    fontSize: 12,
    padding: 6,
    textAlign: "left",
    flex: 1,
    flexWrap: "wrap",
    overflow: "hidden",
    whiteSpace: 'normal', // Ensure wrapping here too
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000000",
    marginBottom: 5,
  },
  subTitle: {
    marginBottom: 5,
    fontSize: 12,
    color: "#000000",
  },
  text: {
    fontWeight: "semibold",
    fontSize: 12,
    color: "#000000",
  },
   footer: {
    position: 'absolute',
    bottom: 30, // adjust as needed
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    color: 'gray',
  },
});

// Format date
const formatDate = (date) => {
  if (!date) return 'Invalid Date';
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) return 'Invalid Date';

  const day = String(parsedDate.getDate()).padStart(2, '0');
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  const year = parsedDate.getFullYear();

  return `${day}/${month}/${year}`;
};

const ReportPDF = ({ reportData }) => {
  if (!reportData) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.header}>Error: Report Data is Missing</Text>
        </Page>
      </Document>
    );
  }

  const {
    reportNumber = "N/A",

    description = "N/A",

    title = "N/A",
    startDate = "N/A",
    endDate = "N/A",

    indicators: {
      paymentStatus = {},
      overdueAnalysis = {},
      invoicePatterns = {},
      invoiceEntities = {}

    } = {},


  } = reportData;

  return (
   <Document>
  <Page size="A4" style={styles.page}>
    {/* Title Section */}
    <Text style={[styles.header, { textAlign: 'center' }]}>{title}</Text>
    <Text style={[styles.title, { textAlign: 'center' }]}>{reportNumber}</Text>

    {/* Date Range */}
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
      <View style={{ flex: 1 }}>
        <Text style={styles.subTitle}>
          <Text style={{ fontWeight: 'bold' }}>Start Date:</Text> {formatDate(startDate)}
        </Text>
      </View>
      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <Text style={styles.subTitle}>
          <Text style={{ fontWeight: 'bold' }}>End Date:</Text> {formatDate(endDate)}
        </Text>
      </View>
    </View>

    {/* Description */}
    <Text style={styles.subTitle}>{description}</Text>

    {/* Payment Status Section */}
    {paymentStatus?.numberOfPaidInvoices || paymentStatus?.numberOfUnpaidInvoices || paymentStatus?.percentPaid || paymentStatus?.percentUnpaid ? (
      <View style={styles.section}>
        <Text style={styles.titleText}>Payment Status</Text>
        {paymentStatus?.numberOfPaidInvoices && paymentStatus.numberOfPaidInvoices !== 0 && (
          <Text style={styles.text}>
            Paid Invoices: <Text style={styles.value}>{paymentStatus.numberOfPaidInvoices}</Text>
          </Text>
        )}
        {paymentStatus?.numberOfUnpaidInvoices && paymentStatus.numberOfUnpaidInvoices !== 0 && (
          <Text style={styles.text}>
            Unpaid Invoices: <Text style={styles.value}>{paymentStatus.numberOfUnpaidInvoices}</Text>
          </Text>
        )}
        {paymentStatus?.percentPaid && paymentStatus.percentPaid !== 0 && (
          <Text style={styles.text}>
            Percent Paid: <Text style={styles.value}>{paymentStatus.percentPaid.toFixed(2)}%</Text>
          </Text>
        )}
        {paymentStatus?.percentUnpaid && paymentStatus.percentUnpaid !== 0 && (
          <Text style={styles.text}>
            Percent Unpaid: <Text style={styles.value}>{paymentStatus.percentUnpaid.toFixed(2)}%</Text>
          </Text>
        )}
      </View>
    ) : null}

    {/* Overdue Analysis Section */}
    {overdueAnalysis?.numberOfOnTimeInvoices || overdueAnalysis?.numberOfOverdueInvoices || overdueAnalysis?.percentOnTime || overdueAnalysis?.percentOverdue ? (
      <View style={styles.section}>
        <Text style={styles.titleText}>Overdue Analysis</Text>
        {overdueAnalysis?.numberOfOnTimeInvoices && overdueAnalysis.numberOfOnTimeInvoices !== 0 && (
          <Text style={styles.text}>
            Invoices Paid On Time: <Text style={styles.value}>{overdueAnalysis.numberOfOnTimeInvoices}</Text>
          </Text>
        )}
        {overdueAnalysis?.numberOfOverdueInvoices && overdueAnalysis.numberOfOverdueInvoices !== 0 && (
          <Text style={styles.text}>
            Overdue Invoices: <Text style={styles.value}>{overdueAnalysis.numberOfOverdueInvoices}</Text>
          </Text>
        )}
        {overdueAnalysis?.percentOnTime && overdueAnalysis.percentOnTime !== 0 && (
          <Text style={styles.text}>
            Percent On Time: <Text style={styles.value}>{overdueAnalysis.percentOnTime.toFixed(2)}%</Text>
          </Text>
        )}
        {overdueAnalysis?.percentOverdue && overdueAnalysis.percentOverdue !== 0 && (
          <Text style={styles.text}>
            Percent Overdue: <Text style={styles.value}>{overdueAnalysis.percentOverdue.toFixed(2)}%</Text>
          </Text>
        )}
      </View>
    ) : null}

    {/* Invoice Entities Section */}
    {invoiceEntities?.numberOfIndividualClients || invoiceEntities?.numberOfCompanyClients || invoiceEntities?.numberOfIndividualVendors || invoiceEntities?.numberOfCompanyVendors || invoiceEntities?.numberOfProducts || invoiceEntities?.numberOfServices || invoiceEntities?.percentOfIndividualClients || invoiceEntities?.percentOfCompanyClients || invoiceEntities?.percentOfIndividualVendors || invoiceEntities?.percentOfCompanyVendors || invoiceEntities?.percentOfProducts || invoiceEntities?.percentOfServices ? (
      <View style={styles.section}>
        <Text style={styles.titleText}>Invoice Entities</Text>
        {invoiceEntities?.numberOfIndividualClients && invoiceEntities.numberOfIndividualClients !== 0 && (
          <Text style={styles.text}>
            Number of Individual Clients: <Text style={styles.value}>{invoiceEntities.numberOfIndividualClients}</Text>
          </Text>
        )}
        {invoiceEntities?.numberOfCompanyClients && invoiceEntities.numberOfCompanyClients !== 0 && (
          <Text style={styles.text}>
            Number of Company Clients: <Text style={styles.value}>{invoiceEntities.numberOfCompanyClients}</Text>
          </Text>
        )}
        {invoiceEntities?.numberOfIndividualVendors && invoiceEntities.numberOfIndividualVendors !== 0 && (
          <Text style={styles.text}>
            Number of Individual Vendors: <Text style={styles.value}>{invoiceEntities.numberOfIndividualVendors}</Text>
          </Text>
        )}
        {invoiceEntities?.numberOfCompanyVendors && invoiceEntities.numberOfCompanyVendors !== 0 && (
          <Text style={styles.text}>
            Number of Company Vendors: <Text style={styles.value}>{invoiceEntities.numberOfCompanyVendors}</Text>
          </Text>
        )}
        {invoiceEntities?.numberOfProducts && invoiceEntities.numberOfProducts !== 0 && (
          <Text style={styles.text}>
            Number of Products: <Text style={styles.value}>{invoiceEntities.numberOfProducts}</Text>
          </Text>
        )}
        {invoiceEntities?.numberOfServices && invoiceEntities.numberOfServices !== 0 && (
          <Text style={styles.text}>
            Number of Services: <Text style={styles.value}>{invoiceEntities.numberOfServices}</Text>
          </Text>
        )}
        {invoiceEntities?.percentOfIndividualClients && invoiceEntities.percentOfIndividualClients !== 0 && (
          <Text style={styles.text}>
            Percent of Individual Clients: <Text style={styles.value}>{invoiceEntities.percentOfIndividualClients.toFixed(2)}%</Text>
          </Text>
        )}
        {invoiceEntities?.percentOfCompanyClients && invoiceEntities.percentOfCompanyClients !== 0 && (
          <Text style={styles.text}>
            Percent of Company Clients: <Text style={styles.value}>{invoiceEntities.percentOfCompanyClients.toFixed(2)}%</Text>
          </Text>
        )}
        {invoiceEntities?.percentOfIndividualVendors && invoiceEntities.percentOfIndividualVendors !== 0 && (
          <Text style={styles.text}>
            Percent of Individual Vendors: <Text style={styles.value}>{invoiceEntities.percentOfIndividualVendors.toFixed(2)}%</Text>
          </Text>
        )}
        {invoiceEntities?.percentOfCompanyVendors && invoiceEntities.percentOfCompanyVendors !== 0 && (
          <Text style={styles.text}>
            Percent of Company Vendors: <Text style={styles.value}>{invoiceEntities.percentOfCompanyVendors.toFixed(2)}%</Text>
          </Text>
        )}
        {invoiceEntities?.percentOfProducts && invoiceEntities.percentOfProducts !== 0 && (
          <Text style={styles.text}>
            Percent of Products: <Text style={styles.value}>{invoiceEntities.percentOfProducts.toFixed(2)}%</Text>
          </Text>
        )}
        {invoiceEntities?.percentOfServices && invoiceEntities.percentOfServices !== 0 && (
          <Text style={styles.text}>
            Percent of Services: <Text style={styles.value}>{invoiceEntities.percentOfServices.toFixed(2)}%</Text>
          </Text>
        )}
      </View>
    ) : null}

    {/* Invoice Patterns Section */}
    {invoicePatterns?.averageDaysToPayment || invoicePatterns?.medianDaysToPayment || invoicePatterns?.modeOfPaymentDelays ? (
      <View style={styles.section}>
        <Text style={styles.titleText}>Invoice Patterns</Text>
        {invoicePatterns?.averageDaysToPayment && invoicePatterns.averageDaysToPayment !== 0 && (
          <Text style={styles.text}>
            Average Days to Payment: <Text style={styles.value}>{invoicePatterns.averageDaysToPayment}</Text>
          </Text>
        )}
        {invoicePatterns?.medianDaysToPayment && invoicePatterns.medianDaysToPayment !== 0 && (
          <Text style={styles.text}>
            Median Days to Payment: <Text style={styles.value}>{invoicePatterns.medianDaysToPayment}</Text>
          </Text>
        )}
        {invoicePatterns?.modeOfPaymentDelays && invoicePatterns.modeOfPaymentDelays !== 0 && (
          <Text style={styles.text}>
            Mode of Payment Delays: <Text style={styles.value}>{invoicePatterns.modeOfPaymentDelays}</Text>
          </Text>
        )}
      </View>
    ) : null}

    <View fixed style={styles.footer}>
      <Text>Note: Indicators with the value 0 are not displayed even if they are selected beforehand!</Text>
    </View>
  </Page>
</Document>



  );
};

export default ReportPDF;