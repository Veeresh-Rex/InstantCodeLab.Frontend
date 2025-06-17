import { Route, Routes } from 'react-router-dom';

import IndexPage from '@/pages/index';
import AboutUs from '@/pages/aboutus';
import FqaPage from '@/pages/fqa';
import Feature from '@/pages/feature';
import NewSetup from '@/pages/newsetup';
import Editor from '@/pages/editorPage';

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path='/' />
      <Route element={<AboutUs />} path='/about' />
      <Route element={<Feature />} path='/feature' />
      <Route element={<NewSetup />} path='/new' />
      <Route element={<FqaPage />} path='/fqa' />
      <Route element={<Editor IsAdmin={false} />} path='/editor/:id' />
      <Route element={<Editor IsAdmin={true} />} path='/editor/admin/:id' />
    </Routes>
  );
}

export default App;
