export const handleDelete = (colName, docID) => {
    const collectionName = colName;
    const docId = docID; 

    deleteDocument(collectionName, docId);
  };