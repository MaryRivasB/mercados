import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import logoEmpresa from '../../assets/images/logoEmpresa.jpg';

const TramiteImprimible = () => {
  const componentRef = useRef();

  const generatePDF = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className='mx-6 lg:mx-28 my-10'>
      <div className='flex flex-col md:flex-row justify-between mb-5 gap-4'>
        <p className='text-xl md:text-3xl font-Foco-Corp-Bold text-naranja'>Formato de tercera edad o discapacitados</p>
        <button className='h-9 w-full md:w-60 px-5 py-1 font-Foco-Corp-Bold shadow-md bg-naranja hover:opacity-80 text-white text-lg rounded-md' onClick={ generatePDF }>Imprimir</button>
      </div>
      <div className='border-2 lg:p-10'>
        {/* contenido que se imprime */}
        <div className="px-10 lg:px-16" ref={componentRef}>
          <div className="flex py-4">
            <img
              className="h-20"
              src={logoEmpresa}
              alt="Logo de la empresa"
            />
          </div>
          <div className="flex flex-col col-span-2 text-right mb-8">
            <p className="font-Foco-Corp-Bold text-lg antialiased">ZONA V</p>
            <p className="font-Foco-Corp-Bold text-lg antialiased">EXPEDIENTE: 000024</p>
          </div>
          <div className='mb-8 font-Foco-Corp text-lg text-justify text-justify-last antialiased'>
            <p>Para efectos de otorgar el beneficio fiscal por concepto de uso de suelo establecido en el Artículo 65 en su último párrafo de la Ley de Ingresos del Municipio de Tlajomulco de Zúñiga, Jalisco, para el Ejercicio Fiscal 2023, se han cumplido los requisitos para su otorgamiento así como para la emisión del permiso correspondiente a favor de:</p>
          </div>
          <div className="grid grid-cols-4 gap-y-2 gap-x-8 md:gap-x-0 font-Foco-Corp text-base mb-4">
            <div className="col-span-1">NOMBRE:</div>
            <div className="col-span-3">ANGELICA ARACELI SILVA PALMAS</div>
            <div className="col-span-1">UBICACIÓN:</div>
            <div className="col-span-3">HIGUERA #90 PRADOS DE LA HIGUERA 45640</div>
            <div className="col-span-1">CRUCES:</div>
            <div className="col-span-3">JACARANDA Y TABACHINES</div>
            <div className="col-span-1">LOCALIDAD:</div>
            <div className="col-span-3">PRADOS DE LA HIGUERA</div>
            <div className="col-span-1">GIRO:</div>
            <div className="col-span-3">ALIMENTOS </div>
            <div className="col-span-1">HORARIO:</div>
            <div className="col-span-3">MAT 7:00 A 6:00</div>
            <div className="col-span-1">METROS:</div>
            <div className="col-span-3">2X2</div>
            <div className="col-span-1">VIGENCIA:</div>
            <div className="col-span-3">25/12/2023</div>
          </div>
          <div className="flex flex-col col-span-2 gap-0 text-right mb-10 md:mb-5">
            <p className="font-Foco-Corp-Bold text-lg antialiased mb-20">ATENTAMENTE</p>
            <p className="font-Foco-Corp-Bold text-base antialiased "> ING. ALAN ISRAEL RODRIGUEZ MONTAÑEZ</p>
            <p className="font-Foco-Corp-Bold text-base antialiased ">JEFATURA DE MERCADOS</p>
            <p className="font-Foco-Corp-Bold text-base antialiased ">DIRECCIÓN GENERAL DE PADRÓN Y LICENCIAS</p>
          </div>
          <div className="flex flex-col col-span-2 gap-0 text-left mb-5">
            <p className="font-Foco-Corp-Bold text-base antialiased mb-20">FIRMA DE ENTERADO</p>
            <p className="font-Foco-Corp-Bold text-base antialiased ">LIC. CLAUDIA BALBINA ROMERO MORANDO</p>
            <p className="font-Foco-Corp-Bold text-base antialiased ">DIRECTORA GENERAL DE INGRESOS</p>
          </div>
          <div className='font-Foco-Corp text-base text-justify text-justify-last antialiased mb-12'>
            <p>El permiso está sujeto a revocación en caso de que el beneficiario no trabaje el puesto y en ningún caso crea derechos ni antigüedad.</p>
          </div>
        </div>
        {/* fin */}
      </div>
    </div>
  );
};

function TerceraEdad() {
  return (
    <div>
      <TramiteImprimible/>
    </div>
  );
}

export default TerceraEdad;
