import React from "react";
import { Page, Text, View, Document, StyleSheet, Font } from "@react-pdf/renderer";

// Register the Poppins font from the public directory
Font.register({
  family: 'Poppins',
  src: '/fonts/Poppins-Regular.ttf', // Regular font
  fontStyle: 'normal',
  fontWeight: 400, // Regular weight
  fonts: [
    { src: '/fonts/Poppins-Regular.ttf', fontStyle: 'normal', fontWeight: 'normal' }, // Regular
    { src: '/fonts/Poppins-SemiBold.ttf', fontStyle: 'normal', fontWeight: '600' },  // SemiBold
    { src: '/fonts/Poppins-Medium.ttf', fontStyle: 'normal', fontWeight: '500' },    // Medium
  ]
});

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Poppins", // Apply Poppins font
    backgroundColor: "#f4f4f4", // Light background for the whole page
  },
  section: { marginBottom: 15 },
  header: {
    fontSize: 24,
    fontWeight: "600", // SemiBold weight
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
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
    padding: 8,
  },
  cell: {
    flex: 1,
    textAlign: "left",
    fontSize: 12,
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    borderRightStyle: "solid",
    color: "#333",
  },
  lastCell: {
    borderRightWidth: 0,
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#555",
  },
  subTitle: {
    marginBottom: 5,
    fontSize: 12,
    color: "#777",
  },
});

// Helper function to format date
const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

const InvoicePDF = ({ invoiceData }) => {
  if (!invoiceData) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.header}>Error: Invoice Data is Missing</Text>
        </Page>
      </Document>
    );
  }

  const {
    invoiceNumber = "N/A",
    issue_date = "N/A",
    due_date = "N/A",
    clientName = "N/A",
    clientEmail = "N/A",
    clientAddress = "N/A",
    vendorName = "N/A",
    vendorEmail = "N/A",
    vendorAddress = "N/A",
    items = [],
  } = invoiceData;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Invoice: {invoiceNumber}</Text>

        {/* Client Info */}
        <View style={styles.section}>
          <Text style={styles.titleText}>Client Information</Text>
          <Text style={styles.subTitle}><strong>Name:</strong> {clientName}</Text>
          <Text style={styles.subTitle}><strong>Email:</strong> {clientEmail}</Text>
          <Text style={styles.subTitle}><strong>Address:</strong> {clientAddress}</Text>
        </View>

        {/* Vendor Info */}
        <View style={styles.section}>
          <Text style={styles.titleText}>Vendor Information</Text>
          <Text style={styles.subTitle}><strong>Name:</strong> {vendorName}</Text>
          <Text style={styles.subTitle}><strong>Email:</strong> {vendorEmail}</Text>
          <Text style={styles.subTitle}><strong>Address:</strong> {vendorAddress}</Text>
        </View>

        {/* Date Info */}
        <View style={styles.section}>
          <Text style={styles.titleText}>Invoice Dates</Text>
          <Text style={styles.subTitle}><strong>Issue Date:</strong> {formatDate(issue_date)}</Text>
          <Text style={styles.subTitle}><strong>Due Date:</strong> {formatDate(due_date)}</Text>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.cell}><strong>Item Name</strong></Text>
            <Text style={styles.cell}><strong>Quantity</strong></Text>
            <Text style={styles.cell}><strong>Unit Price</strong></Text>
            <Text style={styles.lastCell}><strong>Total</strong></Text>
          </View>

          {items.map((item, index) => (
            <View style={styles.row} key={index}>
              <Text style={styles.cell}>{item.itemName}</Text>
              <Text style={styles.cell}>{item.quantity}</Text>
              <Text style={styles.cell}>{item.unitPrice.toFixed(2)}</Text>
              <Text style={styles.lastCell}>{(item.unitPrice * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
