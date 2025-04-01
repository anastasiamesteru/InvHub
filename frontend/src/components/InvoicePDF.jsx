import React from "react";
import { Page, Text, View, Document, StyleSheet, Font } from "@react-pdf/renderer";

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
    color: "#000000", 
  },
  lastCell: {
    borderRightWidth: 0,
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


const formatDate = (date) => {
  if (!date) return 'Invalid Date';
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) return 'Invalid Date';

  const day = String(parsedDate.getDate()).padStart(2, '0'); 
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); 
  const year = parsedDate.getFullYear();

  return `${day}/${month}/${year}`;
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

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
  <View style={{ flex: 1 }}>
    <Text style={styles.subTitle}>
      <Text style={{ fontWeight: 'bold' }}>Issue Date:</Text> {formatDate(issue_date)}
    </Text>
  </View>

  <View style={{ flex: 1, alignItems: 'flex-end' }}>
    <Text style={styles.subTitle}>
      <Text style={{ fontWeight: 'bold' }}>Due Date:</Text> {formatDate(due_date)}
    </Text>
  </View>
</View>


        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        {/* Client Info - Left aligned */}
          <View style={{ flex: 1 }}>
            <Text style={styles.titleText}>Client Information</Text>
            <Text style={styles.subTitle}><Text style={{ fontWeight: 'bold' }}>Name:</Text> {clientName}</Text>
            <Text style={styles.subTitle}><Text style={{ fontWeight: 'bold' }}>Email:</Text> {clientEmail}</Text>
            <Text style={styles.subTitle}><Text style={{ fontWeight: 'bold' }}>Address:</Text> {clientAddress}</Text>
          </View>

          {/* Vendor Info - Right aligned */}
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={styles.titleText}>Vendor Information</Text>
            <Text style={styles.subTitle}><Text style={{ fontWeight: 'bold' }}>Name:</Text> {vendorName}</Text>
            <Text style={styles.subTitle}><Text style={{ fontWeight: 'bold' }}>Email:</Text> {vendorEmail}</Text>
            <Text style={styles.subTitle}><Text style={{ fontWeight: 'bold' }}>Address:</Text> {vendorAddress}</Text>
          </View>
        </View>



        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={[styles.cell, { fontWeight: 'bold' }]}>Item Name</Text>
            <Text style={[styles.cell, { fontWeight: 'bold' }]}>Quantity</Text>
            <Text style={[styles.cell, { fontWeight: 'bold' }]}>Unit Price</Text>
            <Text style={[styles.lastCell, { fontWeight: 'bold' }]}>Total</Text>
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
