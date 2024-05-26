import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./components/Client/home";
import Login from "./components/Client/auth/login";
import SignUp from "./components/Client/auth/signup";
import UserProfile from "./components/Client/userprofile";
import Books from "./components/Client/books";
import { UserProvider } from "./components/Client/Global/UserData";
import NotFound from "./components/Client/Global/NotFound";
import Borrow from "./components/Client/Book/Borrow";
import EditUserProfile from "./components/Client/userProfile/EditUserProfile";

import StaffSignup from "./components/Admin/auth/staffSignup";
import DashBoard from "./components/Admin/DashBoard";
import BorrowRequests from "./components/Admin/BorrowRequests";
import ResponseRequest from "./components/Admin/BorrowRequest/ResponseRequest";
import Settings from "./components/Admin/Settings";
import Notifications from "./components/Client/notifications";
import AddBook from "./components/Admin/Book/AddBook";
import UpdateBook from "./components/Admin/Book/UpdateBook";
import BookLabel from "./components/Admin/Book/BookLabel";
import HandleQrRequest from "./components/HandleQrRequest";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {["/", "/home"].map((path, i) => (
          <Route
            key={i}
            path={path}
            element={
              <UserProvider>
                <Home />
              </UserProvider>
            }
          />
        ))}
        <Route
          path="/books"
          element={
            <UserProvider>
              <Books />
            </UserProvider>
          }
        />
        <Route
          path="/notifications"
          element={
            <UserProvider>
              <Notifications />
            </UserProvider>
          }
        />
        <Route
          path="/books/search/:author/:title/:isAvailable"
          element={
            <UserProvider>
              <Books />
            </UserProvider>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/u/:username" element={<UserProfile />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route
          path="/book/borrow/:Request/:EncryptedBookInfo"
          element={
            <UserProvider>
              <Borrow />
            </UserProvider>
          }
        />
        <Route
          path="/u/:username/edit"
          element={
            <UserProvider>
              <EditUserProfile />
            </UserProvider>
          }
        />

        <Route path="/admin/signup" element={<StaffSignup />} />
        {["/admin/dashboard", "/admin"].map((path, i) => (
          <Route
            key={i}
            path={path}
            element={
              <UserProvider>
                <DashBoard />
              </UserProvider>
            }
          />
        ))}
        <Route
          path="/admin/borrow/requests/"
          element={
            <UserProvider>
              <BorrowRequests />
            </UserProvider>
          }
        />
        <Route
          path="/admin/response/request/:borrow_id"
          element={
            <UserProvider>
              <ResponseRequest />
            </UserProvider>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <UserProvider>
              <Settings />
            </UserProvider>
          }
        />
        <Route
          path="/admin/book/add"
          element={
            <UserProvider>
              <AddBook />
            </UserProvider>
          }
        />
        <Route
          path="/admin/book/update/:id?"
          element={
            <UserProvider>
              <UpdateBook />
            </UserProvider>
          }
        />
        <Route
          path="/redirect/qr/:id"
          element={
            <UserProvider>
              <HandleQrRequest />
            </UserProvider>
          }
        />
        <Route
          path="/admin/book/label/:id?/:type?"
          element={
            <UserProvider>
              <BookLabel />
            </UserProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
