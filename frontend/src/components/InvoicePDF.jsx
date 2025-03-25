import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 10 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  table: { display: "flex", width: "100%", flexDirection: "column", border: "1px solid black" },
  row: { flexDirection: "row", borderBottom: "1px solid black" },
  cell: { padding: 5, flex: 1, borderRight: "1px solid black", fontSize: 12 },
  lastCell: { borderRight: "none" },
});

// Invoice PDF Component
const InvoicePDF = ({ invoiceData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.section}>
        <Text style={styles.header}>Invoice #{invoiceData.invoiceNumber}</Text>
        <Text>Issue Date: {invoiceData.issueDate}</Text>
        <Text>Due Date: {invoiceData.dueDate}</Text>
      </View>

      {/* Client Info */}
      <View style={styles.section}>
        <Text style={styles.header}>Client Information</Text>
        <Text>{invoiceData.clientName}</Text>
        <Text>{invoiceData.clientEmail}</Text>
        <Text>{invoiceData.clientAddress}</Text>
      </View>

      {/* Vendor Info */}
      <View style={styles.section}>
        <Text style={styles.header}>Vendor Information</Text>
        <Text>{invoiceData.vendorName}</Text>
        <Text>{invoiceData.vendorEmail}</Text>
        <Text>{invoiceData.vendorAddress}</Text>
      </View>

      {/* Items Table */}
      <View style={styles.section}>
        <Text style={styles.header}>Items</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.row}>
            <Text style={styles.cell}>Name</Text>
            <Text style={styles.cell}>Quantity</Text>
            <Text style={[styles.cell, styles.lastCell]}>Price</Text>
          </View>
          {/* Table Rows */}
          {invoiceData.items.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.cell}>{item.name}</Text>
              <Text style={styles.cell}>{item.quantity}</Text>
              <Text style={[styles.cell, styles.lastCell]}>${item.price.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Total */}
      <View style={styles.section}>
        <Text style={styles.header}>Total: ${invoiceData.total.toFixed(2)}</Text>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;
