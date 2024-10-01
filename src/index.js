import "./i18n"
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppInit from "./App-main";
import VerfyID from "./forms/verfyID"
import AuthServices from "./auth_services/AuthServices"
import SignUp from "./forms/sign-up"
import SignIn from "./forms/sign-in"
import Home from "./pages/home-page/Home"
import PhoneNumber from "./forms/phone_number";
import { Provider } from 'react-redux';
import store from "./context/data_context"
import { PrivateRoute } from "./hooks/routs";
import { AuthProvider } from "./hooks/useExistance";
import StaffRegisterStock from "./pages/stock/register-stock";
// import  AssetReg  from "./pages/admin/registration/assets"
import StaffSaleReport from "./pages/staff-report/report";
import Stock from "./pages/stock/Stock";
import ResetPassword from "./auth_services/resetPassword";
import AdminHome from "./pages/admin/home/home";
import StaffRegister from "./pages/admin/staff/register"
import AssetRegister from "./pages/admin/assets/register";
import Details from "./pages/admin/staff/details";
import ManagePersonalInfo from "./pages/admin/staff/managePersonalInfo";
import ManageAccount from "./pages/admin/staff/manageAccount";
import AssetDetails from "./pages/admin/assets/details";
import ManageAsset from "./pages/admin/assets/manage";
import AddStock from "./pages/admin/assets/addStock";
import AssetReport from "./pages/admin/assets/report";
import SalesReport from "./pages/admin/reports/sales-report";
import StockReport from "./pages/admin/reports/stock-report";
import StaffReport from "./pages/admin/staff/report";
import AllAssetListView from "./pages/admin/assets/assetList";


export default function App() {
    
    
    return (
        
        <Provider store={store}>
            <Routes>
                <Route  path="/" element={<AppInit />} />
                <Route  path="/verfyID" element={<VerfyID />} />
                <Route  path="/authServices" element={<PrivateRoute element ={AuthServices} />} />
                <Route  path="/signUp" element={<PrivateRoute element={SignUp} />} />
                <Route  path="/signIn" element={<PrivateRoute element={SignIn} />} />
                <Route  path="/phoneInput" element={<PrivateRoute element={PhoneNumber} />} />
                <Route  path="/reset-password" element={<PrivateRoute element={ResetPassword} />} />
                {/* staff urls*/}
                <Route  path="/home" element={<PrivateRoute element={Home} />} />
                <Route  path="/staff-report" element={<PrivateRoute element={StaffSaleReport} />} />
                <Route  path="/stock" element={<Stock />}  />
                <Route  path="/register" element={<StaffRegisterStock />}  />

                {/* admin urls*/}
                {/* <Route  path="/assetReg" element={<AssetReg />}  /> */}
                <Route  path="/admin" element={<AdminHome />}  />
                <Route  path="/register-staff" element={<StaffRegister />}  />
                <Route  path="/register-asset" element={<AssetRegister />}  />
                <Route  path="/sales-report" element={<SalesReport />}  />
                <Route  path="/stock-report" element={<StockReport />}  />

                <Route  path="/staff-det" element={<Details />}  />
                <Route  path="/manage-info" element={<ManagePersonalInfo />}  />
                <Route  path="/manage-account" element={<ManageAccount />}  />

                <Route  path="/asset-det" element={<AssetDetails />}  />
                <Route  path="/asset-manage" element={<ManageAsset />}  />
                <Route  path="/add-stock" element={<AddStock />}  />
                <Route  path="/asset-report" element={<AssetReport />}  />
                <Route  path="/staff-report0" element={<StaffReport />}  />
                <Route path="/allAssets" element={<AllAssetListView />}  />

            </Routes>
            </Provider>
    )
}

const root =ReactDOM.createRoot(document.getElementById("root"))
root.render(
    <AuthProvider>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
        </AuthProvider>

)


