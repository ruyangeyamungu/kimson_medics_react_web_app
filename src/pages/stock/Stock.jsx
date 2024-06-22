import React,{useState, useEffect} from "react"
import { ASSETS_COL, db, auth } from "../../App";
import { onSnapshot, collection, query,  orderBy, endAt, startAt } from "firebase/firestore";
import { useSelector } from "react-redux";
import { NavBar } from "../../components/navBar";
import "../../styles/loaders.css";
import  Loader  from "../../loader/Loader";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../../styles/other.css"
import { useTranslation } from 'react-i18next';

const Stock =() => {
    const[color, setColor] =useState('blue')
    const { t } = useTranslation();
    const regNo = useSelector(state => state.regNo);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [queryText, setQueryText] = useState("");
    const [stockData, setstockData] =useState([])
    const [assetTypeInStock, setAssetTypeInStock] =useState()
    const [totalItemsInStock, setTotalItemsInStock] =useState()
    const navigate =useNavigate()
    let x =0;
    let sn =0;
    
    const allQuery= query(collection(db, ASSETS_COL)); 
     // shortsummary for satff day sale report
     onSnapshot(allQuery, (snapshot) => {
      const DataArray = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      }));
      setstockData(DataArray);

   
      stockData.forEach((asset)=>{

          x= x+asset['quantity']
     
      })
      setAssetTypeInStock(stockData.length)
      setTotalItemsInStock(x)
     
  });


    useEffect(() => {

        //STOCK REPORT
        if (queryText.trim() === "" ) {
            const q = query(collection(db, ASSETS_COL), orderBy("name")); 
            const assets = onSnapshot(q, (snapshot) => {
                const dataArray = snapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data(),
                }));
                setData(dataArray);
              setLoading(false);
            });
          return;
        }

          const q = query(collection(db, ASSETS_COL),
                    orderBy("name"),
                    startAt(queryText.toUpperCase()),
                    endAt(queryText.toUpperCase() + "\uf8ff")
        ); 
 
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const searchResults = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setData(searchResults);
        });
    
        // Clean up the subscription on unmount
        return () => unsubscribe();
      }, [queryText]);

      
    if (loading) {
        return <Loader />;
      }

    if (regNo == null) {
        onAuthStateChanged(auth, user =>{
            signOut(auth).then(()=>{
                navigate('/')
            })
        })
      }

    return (
        <>
         {/* HEADER */}
         <NavBar onSearch={setQueryText} Scolor={color}/>

         {/* BODY */}
         <div className="section" >
            
            <div className="form-box">
                <u><h3>{t('stockSummary')}</h3></u>
                <p>{t('assetTypes')}<span style={{color: "green", fontWeight: "bolder"}}>{assetTypeInStock.toLocaleString()}</span></p>
                <p>{t('totalQuantity')}: <span style={{color: "green", fontWeight: "bolder"}}>{totalItemsInStock.toLocaleString()}</span></p>
            </div>   
         
            {/* for all screens display*/}
            <div className="stock-data">
                <center><table className="stock-table" border={1}>
                    <thead>
                        <th>{t('name')}</th>
                        <th>{t('totalQuantity')}</th>
                        <th>{t('price')}</th>
                    </thead>
                    <tbody>
                    {
                        data.map(asset =>(
                            <tr>
                                <td>{asset.name}</td>
                                <td>{asset.quantity.toLocaleString()}</td>
                                <td>{asset.sPrice.toLocaleString()} tsh</td>  
                            </tr>
                        ))
                    }
                    </tbody>
                </table></center>
            </div>
         </div>
        </>

    )
}

export default Stock




