import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import ItemDetails from "./pages/ItemDetails";
import Checkout from "./pages/Checkout";
import OrderConfirmed from "./pages/OrderConfirmed";
import OrderDetail from "./pages/OrderDetail";
import MyOrders from "./pages/MyOrders";
import MyPost from "./pages/MyPost";
import type { NearbyItem } from "./pages/ItemDetails";
import type { Order } from "./types";
import Landing from "./pages/Landing";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import Register from "./pages/Register";

type Page = "landing" | "login" | "register" | "forgot-password" | "dashboard" | "items-by-kategori" | "item-details" | "checkout" | "order-confirmed" | "order-detail" | "my-orders" | "my-post";

type RouteState = {
  page: Page;
  categoryId?: string | null;
};

function normalizePath(pathname: string): string {
  if (!pathname) return "/";
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

function routeFromPath(pathname: string): RouteState {
  const path = normalizePath(pathname);
  if (path.startsWith("/items-by-kategori/")) {
    const parts = path.split("/");
    const categoryId = parts[2] ? decodeURIComponent(parts[2]) : null;
    return { page: "items-by-kategori", categoryId };
  }
  if (path === "/item-details") return { page: "item-details" };
  if (path === "/checkout") return { page: "checkout" };
  if (path === "/order-confirmed") return { page: "order-confirmed" };
  if (path === "/order-detail") return { page: "order-detail" };
  if (path === "/my-orders") return { page: "my-orders" };
  if (path === "/my-post") return { page: "my-post" };
  if (path === "/login") return { page: "login" };
  if (path === "/register") return { page: "register" };
  if (path === "/forgot-password") return { page: "forgot-password" };
  if (path === "/dashboard") return { page: "dashboard" };
  return { page: "landing" };
}

function pathFromRoute(route: RouteState): string {
  if (route.page === "items-by-kategori") {
    return `/items-by-kategori/${encodeURIComponent(route.categoryId ?? "")}`;
  }
  if (route.page === "item-details") return "/item-details";
  if (route.page === "checkout") return "/checkout";
  if (route.page === "order-confirmed") return "/order-confirmed";
  if (route.page === "order-detail") return "/order-detail";
  if (route.page === "my-orders") return "/my-orders";
  if (route.page === "my-post") return "/my-post";
  if (route.page === "login") return "/login";
  if (route.page === "register") return "/register";
  if (route.page === "forgot-password") return "/forgot-password";
  if (route.page === "dashboard") return "/dashboard";
  return "/";
}

function App() {
  const [route, setRoute] = useState<RouteState>(() => routeFromPath(window.location.pathname));
  const [token, setToken] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<NearbyItem | null>(() => {
    const saved = window.sessionStorage.getItem("selected_item");
    if (!saved) return null;
    try {
      return JSON.parse(saved) as NearbyItem;
    } catch {
      return null;
    }
  });
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string | null>(() => {
    return window.sessionStorage.getItem("selected_order_number");
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = window.sessionStorage.getItem("order_history");
    if (!saved) return [];
    try {
      return JSON.parse(saved) as Order[];
    } catch {
      return [];
    }
  });

  const navigateTo = (nextRoute: RouteState, replace = false) => {
    const nextPath = pathFromRoute(nextRoute);
    setRoute(nextRoute);

    if (window.location.pathname !== nextPath) {
      if (replace) {
        window.history.replaceState(null, "", nextPath);
      } else {
        window.history.pushState(null, "", nextPath);
      }
    }
  };

  useEffect(() => {
    const savedToken = window.localStorage.getItem("auth_token") ?? window.sessionStorage.getItem("auth_token");

    if (savedToken) {
      setToken(savedToken);
      if (
        route.page === "landing" ||
        route.page === "login" ||
        route.page === "register" ||
        route.page === "forgot-password"
      ) {
        navigateTo({ page: "dashboard" }, true);
      }
      return;
    }

    const canonicalPath = pathFromRoute(route);
    if (window.location.pathname !== canonicalPath) {
      window.history.replaceState(null, "", canonicalPath);
    }
  }, [route]);

  useEffect(() => {
    const onPopState = () => {
      const nextRoute = routeFromPath(window.location.pathname);
      setRoute(nextRoute);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [token]);

  const handleLoginSuccess = (authToken: string) => {
    setToken(authToken);
    navigateTo({ page: "dashboard" });
  };

  const handleRegisterSuccess = () => {
    navigateTo({ page: "login" });
  };

  const handleViewDetails = (item: NearbyItem) => {
    setSelectedItem(item);
    window.sessionStorage.setItem("selected_item", JSON.stringify(item));
    navigateTo({ page: "item-details" });
  };

  const handleCheckout = () => {
    navigateTo({ page: "checkout" });
  };

  const handleCheckoutBack = () => {
    navigateTo({ page: "item-details" });
  };

  const handleOrderConfirm = () => {
    if (!selectedItem) {
      navigateTo({ page: "dashboard" });
      return;
    }

    const orderNumber = `#EC-${Date.now().toString().slice(-9)}`;
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 3);
    const order: Order = {
      orderNumber,
      item: selectedItem,
      status: "Processing",
      placedAt: new Date().toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      estimatedDelivery: estimatedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      shippingMethod: "Delivery",
      shippingFee: 15000,
      shippingAddress: {
        name: "Sarah Nadia",
        phone: "+62 857 2419 5327",
        street: "Jl. Palem Putri No. 42, RT. 005/RW. 011, Kel. Pondok Kelapa, Kec. Duren Sawit, Jakarta Timur, DKI Jakarta, 13450",
      },
    };

    setOrders((prev) => {
      const next = [order, ...prev];
      window.sessionStorage.setItem("order_history", JSON.stringify(next));
      return next;
    });
    setSelectedOrderNumber(orderNumber);
    window.sessionStorage.setItem("selected_order_number", orderNumber);
    navigateTo({ page: "order-confirmed" });
  };

  const handleViewOrderDetail = () => {
    if (!selectedOrderNumber) {
      navigateTo({ page: "my-orders" });
      return;
    }
    navigateTo({ page: "order-detail" });
  };

  const handleViewOrderFromHistory = (orderNumber: string) => {
    setSelectedOrderNumber(orderNumber);
    window.sessionStorage.setItem("selected_order_number", orderNumber);
    navigateTo({ page: "order-detail" });
  };

  const handleOrderConfirmedContinue = () => {
    navigateTo({ page: "dashboard" });
  };

  const handleMyOrders = () => {
    navigateTo({ page: "my-orders" });
  };

  const handleMyPost = () => {
    navigateTo({ page: "my-post" });
  };

  const handleMyPostBack = () => {
    navigateTo({ page: "dashboard" });
  };

  const handleDetailBack = () => {
    navigateTo({ page: "dashboard" });
  };

  const handleLogout = () => {
    setToken(null);
    window.localStorage.removeItem("auth_token");
    window.sessionStorage.removeItem("auth_token");
    navigateTo({ page: "landing" });
  };

  useEffect(() => {
    if (route.page === "dashboard" && !token) {
      navigateTo({ page: "login" }, true);
    }
  }, [route.page, token]);

  return route.page === "landing" ? (
    <Landing
      onNavigateToLogin={() => navigateTo({ page: "login" })}
      onNavigateToRegister={() => navigateTo({ page: "register" })}
    />
  ) : route.page === "login" ? (
    <Login
      onSwitchToRegister={() => navigateTo({ page: "register" })}
      onLoginSuccess={handleLoginSuccess}
      onForgotPassword={() => navigateTo({ page: "forgot-password" })}
    />
  ) : route.page === "forgot-password" ? (
    <ForgotPassword onBackToLogin={() => navigateTo({ page: "login" })} />
  ) : route.page === "register" ? (
    <Register
      onSwitchToLogin={() => navigateTo({ page: "login" })}
      onRegisterSuccess={handleRegisterSuccess}
    />
  ) : route.page === "item-details" ? (
    <ItemDetails 
      item={selectedItem} 
      onBack={handleDetailBack} 
      onCheckout={handleCheckout}
      token={token}
      onLogout={handleLogout}
      onMyPost={handleMyPost}
      onMyOrders={handleMyOrders}
    />
  ) : route.page === "checkout" ? (
    <Checkout 
      item={selectedItem} 
      onBack={handleCheckoutBack} 
      onOrderConfirm={handleOrderConfirm}
      token={token}
      onLogout={handleLogout}
      onMyPost={handleMyPost}
      onMyOrders={handleMyOrders}
    />
  ) : route.page === "order-confirmed" ? (
    <OrderConfirmed
      item={selectedItem}
      onViewOrderDetail={handleViewOrderDetail}
      onContinueShopping={handleOrderConfirmedContinue}
      token={token}
      onLogout={handleLogout}
      onMyPost={handleMyPost}
      onMyOrders={handleMyOrders}
    />
  ) : route.page === "order-detail" ? (
    <OrderDetail
      order={orders.find((order) => order.orderNumber === selectedOrderNumber) ?? null}
      onBack={handleMyOrders}
      token={token}
      onLogout={handleLogout}
      onMyPost={handleMyPost}
      onMyOrders={handleMyOrders}
    />
  ) : route.page === "my-orders" ? (
    <MyOrders
      orders={orders}
      onBack={handleMyPostBack}
      onViewOrderDetail={handleViewOrderFromHistory}
      token={token}
      onLogout={handleLogout}
      onMyPost={handleMyPost}
      onMyOrders={handleMyOrders}
    />
  ) : route.page === "my-post" ? (
    <MyPost onBack={handleMyPostBack} onViewDetails={handleViewDetails} />
  ) : (
    <Dashboard
      token={token}
      onLogout={handleLogout}
      initialCategoryId={route.page === "items-by-kategori" ? route.categoryId ?? null : null}
      onCategoryNavigate={(categoryId?: string | null) =>
        navigateTo(
          categoryId
            ? { page: "items-by-kategori", categoryId }
            : { page: "dashboard" }
        )
      }
      onViewDetails={handleViewDetails}
      onMyPost={handleMyPost}
      onMyOrders={handleMyOrders}
    />
  );
}

export default App;
