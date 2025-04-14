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
      fontFamily: 'Poppins',
      backgroundColor: '#FFFFFF',
      color: '#000000',
    },
    section: {
      marginBottom: 20,
    },
    titleText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    subTitle: {
      fontSize: 14,
      marginBottom: 5,
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse', // Ensures the borders are merged and clean
      marginBottom: 10,
    },
    tableRow: {
      display: 'flex',
      flexDirection: 'row',
      borderBottom: '1px solid #000', // Horizontal border between rows
      paddingVertical: 8,
    },
    tableCell: {
      flex: 1,
      textAlign: 'center',
      fontSize: 12,
      padding: 5,
      borderRight: '1px solid #000', // Vertical borders between columns
    },
    tableHeader: {
      fontWeight: 'bold',
      backgroundColor: '#f1f1f1', // Light gray background for header
      borderBottom: '2px solid #000', // Thick bottom border to separate from data rows
      fontSize: 14, // Larger font size for header
    },
    tableFooter: {
      display: 'flex',
      flexDirection: 'row',
      fontWeight: 'bold',
      paddingTop: 5,
      paddingBottom: 10,
      borderTop: '2px solid #000', // Top border for footer
      marginTop: 10,
    },
    tableFooterCell: {
      flex: 1,
      textAlign: 'center',
      fontSize: 12,
      padding: 5,
      fontWeight: 'bold',
    },
    header: {
      marginBottom: 30,
      textAlign: 'center',
    },
    reportTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    dateText: {
      fontSize: 14,
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
      financials = {}
    } = {},
  } = reportData;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>{reportNumber}</Text>

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

        <View style={styles.section}>
          <Text style={styles.titleText}>Report Title</Text>
          <Text style={styles.subTitle}>{title}</Text>
        </View>

        {/* Payment Status Table */}
        <View style={styles.section}>
          <Text style={styles.titleText}>Payment Status</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Status</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>Count</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Paid Invoices</Text>
              <Text style={styles.tableCell}>{paymentStatus.numberOfPaidInvoices}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Unpaid Invoices</Text>
              <Text style={styles.tableCell}>{paymentStatus.numberOfUnpaidInvoices}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Pending Invoices</Text>
              <Text style={styles.tableCell}>{paymentStatus.numberOfPendingInvoices}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Compliance Rate</Text>
              <Text style={styles.tableCell}>{paymentStatus.paymentComplianceRate}%</Text>
            </View>
          </View>
        </View>

        {/* Overdue Analysis Table */}
        <View style={styles.section}>
          <Text style={styles.titleText}>Overdue Analysis</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Analysis</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>Count</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Invoices Paid On Time</Text>
              <Text style={styles.tableCell}>{overdueAnalysis.numberOfInvoicesPaidOnTime}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Overdue Invoices</Text>
              <Text style={styles.tableCell}>{overdueAnalysis.numberOfOverdueInvoices}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Overdue 30 Days</Text>
              <Text style={styles.tableCell}>{overdueAnalysis.numberOfInvoicesOverdue30Days}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Overdue 60 Days</Text>
              <Text style={styles.tableCell}>{overdueAnalysis.numberOfInvoicesOverdue60Days}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Overdue 90+ Days</Text>
              <Text style={styles.tableCell}>{overdueAnalysis.numberOfInvoicesOverdue90PlusDays}</Text>
            </View>
          </View>
        </View>

        {/* Financials Table */}
        <View style={styles.section}>
          <Text style={styles.titleText}>Financials</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Financial Data</Text>
              <Text style={[styles.tableCell, styles.tableHeader]}>Amount</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Outstanding Balance</Text>
              <Text style={styles.tableCell}>${financials.outstandingBalance?.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ReportPDF;
