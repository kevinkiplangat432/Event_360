import AppRoutes from "./routes/AppRoutes";


function App() {
  return (
    <div className="App">
      <AppRoutes /> {/* No BrowserRouter here! */}
    </div>
  );
}

export default App;