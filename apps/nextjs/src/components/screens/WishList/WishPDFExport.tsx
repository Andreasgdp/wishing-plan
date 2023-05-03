import React, { useEffect, useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { Wish } from "@prisma/client";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    fontSize: 40,
  },
  text: {
    fontSize: 12,
    marginTop: 10,
  },
  image: {
    marginTop: 10,
    width: 150,
    height: 150,
  },
});

type WishPDFExportProps = {
  wishes: Wish[];
};

// Create Document Component
export const WishPDFExport = (props: WishPDFExportProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>Wishes</Text>
          {props.wishes.map((wish: Wish) => {
            return (
              <>
                <Text style={styles.text} key={wish.id}>
                  Title: {wish.title}: {wish.price}
                </Text>
                <Text style={styles.text} key={wish.id}>
                  Description: {wish.description}
                </Text>
                {wish.imageUrl === null ? (
                  <></>
                ) : (
                  <Image style={styles.image} src={wish.imageUrl}></Image>
                )}
              </>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};
