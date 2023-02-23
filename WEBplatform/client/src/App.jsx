import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Routes } from 'react-router-dom';
import { Layout } from './layout';
import { RequireAuth } from './hoc/RequireAuth' 
import { AuthProvider } from './hoc/AuthProvider';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage'
import GroupsPage from './pages/GroupsPage';
import SingleGroupPage from './pages/SingleGroupPage';
import LearningDirectionsPage from './pages/LearningDirections';
import SingleLearningDirectionPage from './pages/SingleLearningDirectionPage'

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<Layout />}>
    <Route  index element={<div>Home</div>} />
    <Route  path='groups' element={
      <RequireAuth>
        <GroupsPage />
      </RequireAuth>
    } />
    <Route  path='groups/:id' element={
      <RequireAuth>
        <SingleGroupPage />
      </RequireAuth>
    } />
    <Route  path='directions' element={
      <RequireAuth>
        <LearningDirectionsPage />
      </RequireAuth>
    } />
    <Route  path='directions/:id' element={
      <RequireAuth>
        <SingleLearningDirectionPage />
      </RequireAuth>
    } />
    <Route  path='login' element={<LoginPage />} />
    <Route  path='Signup' element={<SignupPage />} />
  </Route>
))

function App() {
  return (
    <div className='App'>
      <AuthProvider>
        <RouterProvider router={router}/>
      </AuthProvider>
    </div>
  );
}

export default App;
