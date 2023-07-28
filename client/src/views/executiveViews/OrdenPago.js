//TODO: ESTE CODIGO SE TIENE QUE REFACTORIZAR URGENTEMENTE
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Select from "react-select";
import selectStyles from "../../components/StyleSelect";
import DatePickerInput from "../../components/DatePickerInput";
import CheckboxInput from "../../components/CheckboxInput";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { ConceptList } from "../../components/ConceptList";
import { showErrorAlert, showInfoAlertOp } from "../../components/SwAlerts";
import { setDateFormat } from "../../components/formatDates";
import DisableableButton from "../../components/DisableableButton";
const moment = require("moment");

const OrdenPago = () => {
  const [options, setOptions] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectBeginDate, setSelectBeginDate] = useState(null);
  const [selectEndDate, setSelectEndDate] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [conceptosPago, setConceptosPago] = useState([]);
  const [totalDaysWorked, setTotalDaysWorked] = useState(0);
  const [ListaDeConceptos, setListaDeConceptos] = useState([]);
  const [total, setTotal] = useState(0);
  const [primerRender, setPrimerRender] = useState(true);

  const location = useLocation();
  const Data = location?.state?.data;
  const merchant = Data ? Data.merchant : null;
  const shop = Data?.shop || {};
  const phone = Data ? Data.phone : null;
  const metrosX = Number(shop.metraje?.split("x")[0]);
  const metrosY = Number(shop.metraje?.split("x")[1]);
  const totalMetraje = metrosX * metrosY;
  const vigencia = shop?.fecha_termino
    ? setDateFormat(shop.fecha_termino)
    : "sin refrendo";

  const handleChange = (option) => {
    setSelectedOption(option);
  };

  const agregaConceptoPago = (e) => {
    if (!isValidForm()) {
      showErrorAlert(
        "Datos invalidos",
        "Ingresa fecha de inicio, de fin y los días que labura el comerciante"
      );
      return;
    }

    if (conceptosPago.length === 0) {
      addConceptoPago();
    } else {
      showInfoAlertOp(
        "Operacion invalida",
        "Solamente puedes agregar un concepto por orden de pago"
      );
    }
  };

  const isValidForm = () => {
    if (selectedOption.value.unidad === "PESOS") {
      return true;
    }
    return (
      selectBeginDate !== null &&
      selectEndDate !== null &&
      selectedDays.length > 0 &&
      selectedOption
    );
  };

  const addConceptoPago = () => {
    setConceptosPago([...conceptosPago, selectedOption.value]);
  };

  const contarDiasDeLaSemana = (
    fechaInicialSinFormato,
    fechaFinalSinFormato,
    diaDeLaSemana
  ) => {
    const fechaInicialConFormato = formatearfechas(fechaInicialSinFormato);
    const fechaFinalConFormato = formatearfechas(fechaFinalSinFormato);
    let inicio = moment(fechaInicialConFormato);
    const fin = moment(fechaFinalConFormato);
    let contador = 0;

    while (inicio.isSameOrBefore(fin)) {
      if (inicio.day() === diccionarioDaysOfWeek.get(diaDeLaSemana)) {
        contador++;
      }
      inicio.add(1, "day");
    }

    return contador;
  };

  useEffect(() => {
    axios
      .get("http://localhost:4000/conceptos")
      .then((res) => {
        setOptions(res.data.options);
        console.log(res.data.options);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (selectBeginDate && selectEndDate && selectedDays.length > 0) {
      let diasTotales = 0;
      for (let i = 0; i <= selectedDays.length; i++) {
        diasTotales += contarDiasDeLaSemana(
          selectBeginDate,
          selectEndDate,
          selectedDays[i]
        );
      }
      setTotalDaysWorked(diasTotales);

      let temporaryTotal = 0;
      for (const concepto of conceptosPago) {
        if (concepto.unidad === "PESOS") {
          temporaryTotal += concepto.importe * diasTotales;
        } else {
          temporaryTotal += concepto.importe * totalMetraje * diasTotales;
        }
      }
      setTotal(temporaryTotal);
    }
  }, [selectBeginDate, selectEndDate, selectedDays]);

  const formatearfechas = (fechaSinFormato) => {
    const fecha = new Date(fechaSinFormato);
    const anio = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const dia = fecha.getDate().toString().padStart(2, "0");
    const fechaFormateada = `${anio}-${mes}-${dia}`;

    return fechaFormateada;
  };

  const setListaDeConceptosAgregados = (conceptosPago) => {
    const ListaDeConceptosAgregados = conceptosPago.map((concepto) => (
      <ConceptList
        key={concepto.idconepto}
        importe={concepto.importe}
        unidad={concepto.unidad}
        metraje={shop ? shop.metraje : ""}
        totalDaysWorked={totalDaysWorked}
      />
    ));
    setListaDeConceptos(ListaDeConceptosAgregados);
  };

  const pushConceptosPago = () => {
    if (primerRender) {
      setListaDeConceptosAgregados(conceptosPago);
      conceptosPago.forEach((concepto) => {
        let subtotal = 0;
        if (concepto.unidad === "PESOS") {
          subtotal = concepto.importe;
          setTotal(subtotal + total);
        } else {
          subtotal = totalMetraje * concepto.importe * totalDaysWorked;
          setTotal(subtotal + total);
        }
      });
      // console.log(conceptosPago);
    } else {
      setPrimerRender(true);
    }
    console.log("hola");
  };

  useEffect(pushConceptosPago, [conceptosPago]);

  const popConceptosPago = (concepto) => {
    const conceptosPagoActualizado = conceptosPago.filter(
      (conceptoPago) => conceptoPago.idconcepto !== concepto.idconcepto
    );
    setConceptosPago(conceptosPagoActualizado);
    setTotal(total - concepto.importe);
    console.log("eliminar");
  };

  const clasificacion = new Map();
  clasificacion.set(1, "COMERCIO AMBULANTE");
  clasificacion.set(2, "COMERCIO EN PUESTO FIJO");
  clasificacion.set(3, "COMERCIO EN PUESTO SEMI-FIJO");
  clasificacion.set(4, "COMERCIO EN PUESTO EN FESTIVIDADES");

  const diccionarioDaysOfWeek = new Map();
  diccionarioDaysOfWeek.set("Lun", 1);
  diccionarioDaysOfWeek.set("Mar", 2);
  diccionarioDaysOfWeek.set("Mie", 3);
  diccionarioDaysOfWeek.set("Jue", 4);
  diccionarioDaysOfWeek.set("Vie", 5);
  diccionarioDaysOfWeek.set("Sab", 6);
  diccionarioDaysOfWeek.set("Dom", 0);

  const merchantAdress = merchant
    ? merchant.calle
        .concat(merchant.numero_exterior)
        .concat(
          merchant.numero_interior ? `, Int: ${merchant.numero_interior}, ` : ""
        )
        .concat(` Entre ${merchant.calle_colindante_uno}`)
        .concat(` y ${merchant.calle_colindante_dos}`)
    : "";

  const merchantFullName = merchant
    ? merchant.nombres.concat(
        " ",
        merchant.apellido_paterno,
        " ",
        merchant.apellido_materno
      )
    : "";

    const createPaymentOrder =  () => {
      const conceptoOrden = conceptosPago
      const montoTotalOrden = total
      const idComercio = merchant.id_comercio
      const fechaInicio = selectBeginDate || "";
      const fechaFin = selectEndDate || "";
      const dias = selectedDays || [];

      axios.post(`http://${process.env.REACT_APP_HOST}:4000/CreatePayOrder`, {conceptoOrden : conceptoOrden, montoTotalOrden : montoTotalOrden, idComercio : idComercio, fechaInicio : fechaInicio, fechaFin : fechaFin, dias : dias})
      .then((res) => {console.log(res.data)})
      .catch((error) => {console.log(error)})
    }

  return (
    <>
      <Header />
      {/* Contenido */}
      <div className="lg:flex lg:flex-row lg:mx-16 sm:mx-4 m-6 lg:my-9 gap-10">
        <div className="w-full lg:w-1/2 text-start">
          <h3 className="text-3xl font-Foco-Corp-Bold text-naranja opacity-80 mb-4 2xl:text-4xl">
            Orden de pago
          </h3>
          <div className="grid grid-cols-4 mb-2">
            <div className="flex flex-col col-span-3 font-Foco-Corp ">
              <h3 className="font-Foco-Corp-Bold text-xl text-gris 2xl:text-2xl">
                Datos del contribuyente
              </h3>
              <p className="text-lg text-black 2xl:text-xl">
                {merchantFullName}
              </p>
              <p className="text-lg text-black 2xl:text-xl">{merchantAdress}</p>
              <p className=" text-lg text-black 2xl:text-xl">
                {phone ? phone[0].numero_telefonico : ""}
              </p>
            </div>
            <div className="flex flex-col col-span-1 items-end">
              <h3 className="font-Foco-Corp-Bold text-xl text-gris 2xl:text-2xl">
                Folio
              </h3>
              <p className="font-Foco-Corp text-lg text-black 2xl:text-xl">
                {String(shop.id_comercio).padStart(6, "0")}
              </p>
            </div>
          </div>
          <div className="mb-2 ">
            <h3 className="font-Foco-Corp-Bold text-xl text-gris 2xl:text-2xl">
              Datos del comercio
            </h3>
          </div>
          <div className="flex flex-col antialiased font-Foco-Corp text-black mb-2 lg:flex-row lg:mb-0 2xl:text-lg">
            <label className="w-full lg:w-1/4">CLASIFICACIÓN:</label>
            <label className="w-full lg:w-3/4">
              {shop &&
                shop.tipo_comercio_id_tipo_comercio &&
                clasificacion.get(shop.tipo_comercio_id_tipo_comercio)}
            </label>
          </div>
          <div className="flex flex-col antialiased font-Foco-Corp text-black mb-2 lg:flex-row lg:mb-0 2xl:text-lg">
            <label className="w-full lg:w-1/4">GIRO/ACTIVIDAD:</label>
            <label className="w-full lg:w-3/4">{shop && shop.giro}</label>
          </div>
          <div className="flex flex-col antialiased font-Foco-Corp text-black mb-2 lg:flex-row lg:mb-0 2xl:text-lg">
            <label className="w-full lg:w-1/4">METROS:</label>
            <label className="w-full lg:w-3/4">{shop.metraje}</label>
          </div>
          <div className="flex flex-col antialiased font-Foco-Corp text-black mb-2 lg:flex-row lg:mb-0 2xl:text-lg">
            <label className="w-full lg:w-1/4">HORARIO:</label>
            <label className="w-full lg:w-3/4">{shop.horario}</label>
          </div>
          <div className="flex flex-col antialiased font-Foco-Corp text-black mb-2 lg:flex-row lg:mb-0 2xl:text-lg">
            <label className="w-full lg:w-1/4">VIGENCIA:</label>
            <label className="w-full lg:w-3/4">{vigencia}</label>
          </div>
          <div className="flex flex-col antialiased font-Foco-Corp text-black mb-2 lg:flex-row lg:mb-0 2xl:text-lg">
            <label className="w-full lg:w-1/4">UBICACIÓN:</label>
            <label className="w-full lg:w-3/4">{merchantAdress}</label>
          </div>
          <div className="flex flex-col antialiased font-Foco-Corp text-black mb-2 lg:flex-row lg:mb-0 2xl:text-lg">
            <label className="w-full lg:w-1/4">LOCALIDAD:</label>
            <label className="w-full lg:w-3/4">
              {shop?.colonia_comercio || ""}
            </label>
          </div>
          {merchant.tercera_edad ? (
            <div className="flex flex-col mt-2 gap-2">
              <label className="font-Foco-Corp-Bold text-xl text-gris 2xl:text-2xl">
                Formato tercera edad/Discapacitados
              </label>
              <Link to={`/TerceraEdad/${merchant.id_comerciante}`}>
                <input
                  type="button"
                  value="GenerarPDF"
                  className="w-full h-10 font-Foco-Corp-Bold text-base text-white text-center bg-azul rounded-lg hover:bg-azul hover:opacity-80 lg:w-56 lg:text-lg 2xl:w-72 2xl:text-xl"
                />
              </Link>
            </div>
          ) : null}
        </div>
        <div className="w-full lg:w-1/2 text-start">
          <div className="mb-3">
            <h3 className="font-Foco-Corp-Bold text-xl text-gris 2xl:text-2xl">
              Agregar concepto de pago
            </h3>
          </div>
          <div className="flex flex-col items-center gap-4 mb-3 lg:flex-row ">
            <div className="w-full lg:w-4/5">
              <Select
                value={selectedOption}
                id="mostrar"
                styles={selectStyles}
                className=" antialiased text-sm"
                placeholder="Seleccione una concepto de pago"
                onChange={handleChange}
                options={options}
              ></Select>
            </div>
            {/* Otros elementos e inputs aquí ... */}

            <DisableableButton
              selectedOption={selectedOption}
              selectBeginDate={selectBeginDate}
              selectEndDate={selectEndDate}
              selectedDays={selectedDays}
              agregaConceptoPago={agregaConceptoPago}
            />
          </div>
          {selectedOption && selectedOption.value.unidad !== "PESOS" ? (
            <div className="flex flex-col md:flex-row gap-x-2 mb-3">
              <div className="w-full md:w-1/3">
                <div className="flex flex-col items-stretch w-full">
                  <label className="font-Foco-Corp-Bold text-gris text-base mb-1">
                    Fecha Inicio
                  </label>
                  <DatePickerInput
                    setSelectedDate={setSelectBeginDate}
                    selectedDate={selectBeginDate}
                  />
                </div>
              </div>
              <div className="w-full md:w-1/3">
                <div className="flex flex-col">
                  <label className="font-Foco-Corp-Bold text-gris text-base mb-1">
                    Fecha Termino
                  </label>
                  <DatePickerInput
                    setSelectedDate={setSelectEndDate}
                    selectedDate={selectEndDate}
                  />
                </div>
              </div>
              <div className="w-full md:w-1/3">
                <div className="flex flex-col ">
                  <label className="font-Foco-Corp-Bold text-gris text-base mb-1">
                    Días
                  </label>
                  <CheckboxInput
                    selectedDays={selectedDays}
                    setSelectedDays={setSelectedDays}
                  />
                </div>
              </div>
            </div>
          ) : null}

          {conceptosPago.length > 0 ? (
            <>
              <div>
                <h3 className="font-Foco-Corp-Bold text-xl text-gris mb-1">
                  Conceptos
                </h3>
              </div>
              <div className="flex flex-col h-20 overflow-y-auto md:h-16 lg:h-14">
                {conceptosPago.map((concepto) => (
                  <div className="flex items-center justify-between gap-x-2 mb-2">
                    <label className="font-Foco-Corp-Bold text-xs text-gris md:text-sm lg:text-base antialiased">
                      {concepto.concepto}
                    </label>
                    <button
                      className="text-gray-500 hover:text-naranja"
                      onClick={() => popConceptosPago(concepto)}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
              <div className="bg-white w-full h-40 overflow-auto md:h-36 mt-4">
                <table className="table-auto">
                  <thead className="bg-gray-100 border">
                    <tr className="font-Foco-Corp text-sm text-black antialiased text-center">
                      <th className="w-2/12 border px-2 py-1">COSTO</th>
                      <th className="w-1/12 border px-2 py-1">CANTIDAD</th>
                      <th className="w-1/12 border px-2 py-1">METROS</th>
                      <th className="w-1/12 border px-2 py-1">DIA/MES</th>
                      <th className="w-1/12 border px-2 py-1">SUBTOTAL</th>
                      <th className="w-6/12 border px-2 py-1">UNIDAD</th>
                    </tr>
                  </thead>
                  <tbody>{ListaDeConceptos}</tbody>
                </table>
              </div>
              <div className="flex w-full gap-4 border-t-2">
                <div className="flex flex-col w-1/4 items-end gap-y-1">
                  <span className="font-Foco-Corp-Bold text-lg antialiased">
                    TOTAL
                  </span>
                </div>
                <div className="flex w-3/4 justify-start">
                  <span className="font-Foco-Corp-Bold text-lg antialiased">
                    {total}
                  </span>
                </div>
              </div>
            </>
          ) : null}

          <div className="w-full border-y-2 text-center">
            <p className="font-Foco-Corp text-xs antialiased">
              TRAMITE EN PROCESO DE AUTORIZACIÓN DE PERSMISO DE COMERCIO EN LA
              VIA PÚBLICA
            </p>
          </div>
        </div>
      </div>
      <footer className="flex flex-col m-6 sm:mx-4 md:grid md:grid-cols-2 md:gap-4 lg:mx-16 lg:grid lg:grid-cols-3 mt-16 2xl:mt-24">
        <div className="text-white text-xl font-Foco-Corp-Bold mb-5 lg:m-0">
          <input
            type="button"
            value="Volver"
            className="self-start text-center bg-verde w-full h-11 rounded-lg lg:w-40"
          />
        </div>
        <div className="flex flex-col text-white text-xl font-Foco-Corp-Bold">
          {/* <Link to="/OrdenPagoPDF"> */}
            <input
              type="submit"
              value={"Generar Orden"}
              className={`self-center text-center bg-naranja w-full h-11 rounded-lg lg:w-80 ${
                conceptosPago.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={createPaymentOrder}
              disabled={conceptosPago.length === 0}
            />
          {/* </Link> */}
        </div>
      </footer>
    </>
  );
};

export default OrdenPago;
