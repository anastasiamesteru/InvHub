import React from "react";
import { Page, Text, View, Document, StyleSheet, Font } from "@react-pdf/renderer";

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
  },
  subTitle: {
    marginBottom: 5,
    fontSize: 12,
    color: "#000000",
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
    title = "N/A",
    startDate = "N/A",
    endDate = "N/A",

    indicators: {
      paymentStatus = {},
      overdueAnalysis = {},
      invoicePatterns = {}
    } = {},
  } = reportData;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
      <Text style={[styles.header, {textAlign:'center'} ]}>{title}</Text>
      <Text style={[styles.title, {textAlign:'center'} ]}>{reportNumber}</Text>
        
        
        <View style={styles.section}></View>

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

       
    <Text style={styles.subTitle}>This report provides a comprehensive overview of invoice activity and payment behavior for the specified reporting period. It highlights key performance indicators related to payment status, overdue trends, and payment timing, offering actionable insights for financial tracking and decision-making.</Text>
    <Text></Text>

        {/* Payment Status Table */}
        <View style={styles.section}>
          <Text style={styles.titleText}>Payment Status</Text>
          <View style={styles.table}>
            {/* Header Row */}
            <View style={styles.row}>
              <Text style={[styles.cell, { fontWeight: 'bold', textAlign: 'center' }]}>Status</Text>
              <Text style={[styles.lastCell, { fontWeight: 'bold', textAlign: 'center' }]}>Count</Text>
            </View>

            {/* Conditional Rows */}
            {paymentStatus.numberOfPaidInvoices != null && (
              <View style={styles.row}>
                <Text style={[styles.cell, { textAlign: 'center' }]}>Paid Invoices</Text>
                <Text style={[styles.lastCell, { textAlign: 'center' }]}>{paymentStatus.numberOfPaidInvoices}</Text>
              </View>
            )}
            {paymentStatus.numberOfUnpaidInvoices != null && (
              <View style={styles.row}>
                <Text style={[styles.cell, { textAlign: 'center' }]}>Unpaid Invoices</Text>
                <Text style={[styles.lastCell, { textAlign: 'center' }]}>{paymentStatus.numberOfUnpaidInvoices}</Text>
              </View>
            )}
            {paymentStatus.percentPaid != null && (
              <View style={styles.row}>
                <Text style={[styles.cell, { textAlign: 'center' }]}>Percent Paid</Text>
                <Text style={[styles.lastCell, { textAlign: 'center' }]}>{paymentStatus.percentPaid.toFixed(2)}%</Text>
              </View>
            )}
            {paymentStatus.percentUnpaid != null && (
              <View style={styles.row}>
                <Text style={[styles.cell, { textAlign: 'center' }]}>Percent Unpaid</Text>
                <Text style={[styles.lastCell, { textAlign: 'center' }]}>{paymentStatus.percentUnpaid.toFixed(2)}%</Text>
              </View>
            )}
          </View>
        </View>


        {/* Overdue Analysis Table */}
        <View style={styles.section}>
          <Text style={styles.titleText}>Overdue Analysis</Text>
          <View style={styles.table}>
            {/* Header Row */}
            <View style={styles.row}>
              <Text style={[styles.cell, { fontWeight: 'bold', textAlign: 'center' }]}>Analysis</Text>
              <Text style={[styles.lastCell, { fontWeight: 'bold', textAlign: 'center' }]}>Count</Text>
            </View>

            {/* Conditionally Rendered Rows */}
            {overdueAnalysis.numberOfOnTimeInvoices != null && (
              <View style={styles.row}>
                <Text style={[styles.cell, { textAlign: 'center' }]}>Invoices Paid On Time</Text>
                <Text style={[styles.lastCell, { textAlign: 'center' }]}>{overdueAnalysis.numberOfOnTimeInvoices}</Text>
              </View>
            )}
            {overdueAnalysis.numberOfOverdueInvoices != null && (
              <View style={styles.row}>
                <Text style={[styles.cell, { textAlign: 'center' }]}>Overdue Invoices</Text>
                <Text style={[styles.lastCell, { textAlign: 'center' }]}>{overdueAnalysis.numberOfOverdueInvoices}</Text>
              </View>
            )}
            {overdueAnalysis.numberOfInvoicesOverdue30Days != null && (
              <View style={styles.row}>
                <Text style={[styles.cell, { textAlign: 'center' }]}>Overdue 30 Days</Text>
                <Text style={[styles.lastCell, { textAlign: 'center' }]}>{overdueAnalysis.numberOfInvoicesOverdue30Days}</Text>
              </View>
            )}
            {overdueAnalysis.numberOfInvoicesOverdue60Days != null && (
              <View style={styles.row}>
                <Text style={[styles.cell, { textAlign: 'center' }]}>Overdue 60 Days</Text>
                <Text style={[styles.lastCell, { textAlign: 'center' }]}>{overdueAnalysis.numberOfInvoicesOverdue60Days}</Text>
              </View>
            )}
            {overdueAnalysis.numberOfInvoicesOverdue90PlusDays != null && (
              <View style={styles.row}>
                <Text style={[styles.cell, { textAlign: 'center' }]}>Overdue 90+ Days</Text>
                <Text style={[styles.lastCell, { textAlign: 'center' }]}>{overdueAnalysis.numberOfInvoicesOverdue90PlusDays}</Text>
              </View>
            )}
            {overdueAnalysis.percentOnTime != null && (
              <View style={styles.row}>
                <Text style={[styles.cell, { textAlign: 'center' }]}>Percent On Time</Text>
                <Text style={[styles.lastCell, { textAlign: 'center' }]}>{overdueAnalysis.percentOnTime}</Text>
              </View>
            )}
            {overdueAnalysis.percentOverdue != null && (
              <View style={styles.row}>
                <Text style={[styles.cell, { textAlign: 'center' }]}>Percent Overdue</Text>
                <Text style={[styles.lastCell, { textAlign: 'center' }]}>{overdueAnalysis.percentOverdue}</Text>
              </View>
            )}
            {overdueAnalysis.percentOverdue30 != null && (
              <View style={styles.row}>
                <Text style={[styles.cell, { textAlign: 'center' }]}>Percent Overdue 30 Days</Text>
                <Text style={[styles.lastCell, { textAlign: 'center' }]}>{overdueAnalysis.percentOverdue30}</Text>
              </View>
            )}
            {overdueAnalysis.percentOverdue60 != null && (
              <View style={styles.row}>
                <Text style={[styles.cell, { textAlign: 'center' }]}>Percent Overdue 60 Days</Text>
                <Text style={[styles.lastCell, { textAlign: 'center' }]}>{overdueAnalysis.percentOverdue60}</Text>
              </View>
            )}
            {overdueAnalysis.percentOverdue90Plus != null && (
              <View style={styles.row}>
                <Text style={[styles.cell, { textAlign: 'center' }]}>Percent Overdue 90+ Days</Text>
                <Text style={[styles.lastCell, { textAlign: 'center' }]}>{overdueAnalysis.percentOverdue90Plus}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Invoice Patterns Table */}
        <View style={styles.section}>
          <Text style={styles.titleText}>Invoice Patterns</Text>
          <View style={styles.table}>
            {/* Header Row */}
            <View style={styles.row}>
              <Text style={[styles.cell, { fontWeight: 'bold', textAlign: 'center' }]}>Invoice Pattern Data</Text>
              <Text style={[styles.lastCell, { fontWeight: 'bold', textAlign: 'center' }]}>Amount</Text>
            </View>

            {/* Conditionally Rendered Rows */}
            {invoicePatterns.averageDaysToPayment != null && (
              <View style={styles.row}>
                <Text style={[styles.cell, { textAlign: 'center' }]}>Average Days to Payment</Text>
                <Text style={[styles.lastCell, { textAlign: 'center' }]}>{invoicePatterns.averageDaysToPayment}</Text>
              </View>
            )}
            {invoicePatterns.medianDaysToPayment != null && (
              <View style={styles.row}>
                <Text style={[styles.cell, { textAlign: 'center' }]}>Median Days to Payment</Text>
                <Text style={[styles.lastCell, { textAlign: 'center' }]}>{invoicePatterns.medianDaysToPayment}</Text>
              </View>
            )}
            {invoicePatterns.modeOfPaymentDelays != null && (
              <View style={styles.row}>
                <Text style={[styles.cell, { textAlign: 'center' }]}>Mode of Payment Delays</Text>
                <Text style={[styles.lastCell, { textAlign: 'center' }]}>{invoicePatterns.modeOfPaymentDelays}</Text>
              </View>
            )}
          </View>
        </View>


      </Page>
    </Document>
  );
};

export default ReportPDF;
