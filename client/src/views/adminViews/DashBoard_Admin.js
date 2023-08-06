import React, { useEffect, useState } from 'react';
import { AuthMiddleware } from '../../middleware/ProtectedMiddleware';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from "../../components/Header";
import Sidebar from '../../components/Sidebar';
import DailyChart  from '../../components/DailyChart';
import WeeklyChart  from '../../components/WeeklyChart';
import MonthlyChart  from '../../components/MonthlyChart';
import { IoGrid, IoPerson, IoChevronForwardCircle, IoPeopleSharp, IoStorefrontSharp} from 'react-icons/io5';

function DashBoard_Admin() {
  const location = useLocation();
  const user = location.state && location.state.data;
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    AuthMiddleware(user, navigate);
  }, [user, navigate]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const data = {
    labels: ['', '', ''],
    datasets: [
      {
        label: '',
        data: [100, 150, 120],
        backgroundColor: ['', '', ''],
      },
    ],
  };

  return (
    <>
      <Header/>
      <div className='flex flex-row'>
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar}/>
        <div className='w-full bg-white overflow-auto'>
          <div className='px-8 pt-8 flex flex-row justify-between items-center'>
            <h3 className="text-2xl md:text-3xl font-Foco-Corp-Bold text-gris 2xl:text-4xl">
              Bienvenido Administrador
            </h3>
            <button onClick={toggleSidebar}>
              {isOpen ? <IoGrid className="text-3xl text-verde hover:text-opacity-80" /> : <IoGrid className="text-3xl text-naranja hover:text-opacity-80" />}
            </button>
          </div>
          <div className="flex flex-col md:grid md:grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-4 px-8 py-6">
            <div className=" bg-naranja bg-opacity-80 border border-naranja text-white font-semibold rounded-md shadow-md">
              <div className='flex flex-row py-4 px-4 justify-between '>
                <div className="w-3/4 flex flex-col gap-2">
                  <span className='text-4xl'>2</span>
                  <span className='text-sm'>Ejecutivos registrados</span>
                </div>
                <div className="w-1/4 text-center ">
                  <IoPerson className="text-7xl text-naranja"/>
                </div>
              </div>
              <button className="w-full flex justify-center items-center gap-2 py-1 rounded-b-md  bg-naranja hover:bg-opacity-60 text-white font-semibold">
                <span className='text-sm'>Ver todos</span>
                <IoChevronForwardCircle className="text-2xl"/>
              </button>
            </div>
            <div className=" bg-verde bg-opacity-80 border border-verde text-white font-semibold rounded-md shadow-md">
              <div className='flex flex-row py-4 px-4 justify-between '>
                <div className="w-3/4 flex flex-col gap-2">
                    <span className='text-4xl'>3000</span>
                    <span className='text-sm'>Comercios registrados</span>
                </div>
                <div className="w-1/4 text-center ">
                  <IoStorefrontSharp className="text-7xl text-verde"/>
                </div>
              </div>
              <button className="w-full flex justify-center items-center gap-2 py-1 rounded-b-md  bg-verde hover:bg-opacity-60 text-white font-semibold">
                <span className='text-sm'>Ver todos</span>
                <IoChevronForwardCircle className="text-2xl"/>
              </button>
            </div>
            <div className=" bg-azul bg-opacity-80 border border-azul text-white font-semibold rounded-md shadow-md">
              <div className='flex flex-row py-4 px-4 justify-between '>
                <div className="w-3/4 flex flex-col gap-2">
                    <span className='text-4xl'>3000</span>
                    <span className='text-sm'>Comerciantes registrados</span>
                </div>
                <div className="w-1/4 text-center ">
                  <IoPeopleSharp className="text-7xl text-azul"/>
                </div>
              </div>
              <button className="w-full flex justify-center items-center gap-2 py-1 rounded-b-md  bg-azul hover:bg-opacity-60 text-white font-semibold">
                <span className='text-sm'>Ver todos</span>
                <IoChevronForwardCircle className="text-2xl"/>
              </button>
            </div>
            <div className=" bg-morado bg-opacity-80 border border-morado text-white font-semibold rounded-md shadow-md">
              <div className='flex flex-row py-4 px-4 justify-between '>
                <div className="w-3/4 flex flex-col gap-2">
                    <span className='text-4xl'>3000</span>
                    <span className='text-sm'>Ingresos totales</span>
                </div>
                <div className="w-1/4 text-center ">
                  <IoStorefrontSharp className="text-7xl text-morado"/>
                </div>
              </div>
              <button className="w-full flex justify-center items-center gap-2 py-1 rounded-b-md  bg-morado hover:bg-opacity-60 text-white font-semibold">
                <span className='text-sm'>Ver todos</span>
                <IoChevronForwardCircle className="text-2xl"/>
              </button>
            </div>
          </div>
          <div className='px-8 pb-4'>
            <h3 className="text-xl font-Foco-Corp-Bold text-gris 2xl:text-3xl">
              Últimos ingresos
            </h3>
          </div>
          <div className='grid grid-cols-3 px-8 gap-5'>
            <div className='w-full flex flex-col p-4 border-2 border-gray-200 rounded-md gap-4 shadow-md'>
              <span className='text-base text-left font-Foco-Corp-Bold text-gris'>Hace 5 días</span>
              <DailyChart data={data} />
            </div>
            <div className='w-full flex flex-col p-4 border-2 border-gray-200 rounded-md gap-4 shadow-md'>
              <span className='text-base text-left font-Foco-Corp-Bold text-gris'>Últimas 4 semanas</span>
              <WeeklyChart data={data} />
            </div>
            <div className='w-full flex flex-col p-4 border-2 border-gray-200 rounded-md gap-4 shadow-md'>
              <span className='text-base text-left font-Foco-Corp-Bold text-gris'>Últimos 6 meses</span>
              <MonthlyChart data={data} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashBoard_Admin;