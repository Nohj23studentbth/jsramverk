//
import React from 'react';
import AppFooter from "../components/includes/AppFooter";
import AppHeader from "../components/includes/AppHeader";
import AppMain from "../components/AppMain";
import ErrorBoundary from '../components/includes/ErrorBoundary';


function App() {
  
  return <>
            <AppHeader />
            <ErrorBoundary>
              <AppMain />
            </ErrorBoundary>
            <AppFooter />
        </>
}

export default App;