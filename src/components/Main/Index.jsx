import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { useForm } from '@inertiajs/react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Index() {
    const {data,setData, reset} = useForm({});
    const [modal, setModal] = useState(false);
    const [openModalConfig, setOpenModalConfig] = useState(false);
    const apiUrl = 'http://127.0.0.1:8000/api';
    const [ciudades,setCiudades] = useState([]);
    const [acomodacioes,setAcomodacioes] = useState([]);
    const [tipoHabitacion,setTipoHabitacion] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [filtroAcomodaciones, setFiltroAcomodaciones] = useState();
    
    const [infoDatatable, setInfoDatatable] = useState({
        data : null,
        firstPage : 1,
        lastPage : 1,
    });

    const [infoAcomodaciones, setInfoAcomodaciones] = useState({
        data: null,
        firstPage: 1,
        lastPage: 1,
    });

    useEffect(() => {
        getHoteles();
        getCiudades();
        getAcomodaciones();
        getTiposHabitacion();
        getConfiguracionHabitaciones();
    },[])
    
    //OBTENER DATA DE TABLAS
    async function getHoteles() {
        const response = await axios.get(`${apiUrl}/hoteles`);
        setInfoDatatable({
            data: response.data,
            firstPage : 1,
            lastPage : 1
        })
    }

    async function getCiudades() {
        const response = await axios.get(`${apiUrl}/ciudades`);
        setCiudades(response.data)
    }

    async function getAcomodaciones() {
        const response = await axios.get(`${apiUrl}/acomodaciones`);
       setAcomodacioes(response.data)
    }

    async function getTiposHabitacion() {
        const response = await axios.get(`${apiUrl}/tipoHabitacion`);
        setTipoHabitacion(response.data)
    }
    
    async function getConfiguracionHabitaciones() {
        const response = await axios.get(`${apiUrl}/config-hab-hotel`);
        setInfoAcomodaciones({
            data: response.data,
            firstPage : 1,
            lastPage : 1
        })   
    }

    //METODOS DE GUARDADO
    async function submit(data) {
        const response = await axios.post(`${apiUrl}/hoteles-store`,data);
        response.data.error ? toast.error(response.data.error) : toast.success('Hotel Creado Exitosamente');
        reset(); 
        setModal(false);
        getHoteles();
        getConfiguracionHabitaciones();
    }
    
    async function saveAcomodacion(data) {
        const response = await axios.post(`${apiUrl}/config-hab-hotel-store`,data)
        response.data.error ? toast.error(response.data.error) : toast.info('Acomodacion Guardada Exitosamente');
        reset(); 
        setOpenModalConfig(false);
        getConfiguracionHabitaciones();
    }

    //METODO DE ELIMINACION
    async function deleteAcomodacion(params){
        console.log(params);
        
        const response = await axios.put(`${apiUrl}/config-hab-hotel-delete/${params}`);
        console.log(response);
        
        response.data.deleted_at ? toast.info('Acomodación Inactivada con exito') : toast.info('Acomodación Activada Exitosamente');
        getConfiguracionHabitaciones();
    }

    async function deleteHotel(params){
        const response = await axios.put(`${apiUrl}/hoteles-delete/${params}`);
        response.data.deleted_at ? toast.info('Hotel Inactivado con exito') : toast.info('Hotel Activada Exitosamente');
        getHoteles();
    }

    // METODOS DE EDICION
    function editHotel(params) {
        setData({
            id         : params.id,
            nombre     : params.nombre,
            direccion  : params.direccion,
            id_ciudad  : params.id_ciudad,
            nit        : params.nit,
            numero_hab : params.numero_hab
        });
        setModal(true);
        setIsEdit(false);
    }

    function editAcomodacion(params) {
        validateTipoHabitacion(params.id_tipo_habitacion);
        setData({
            id                  : params.id,
            id_hotel            : params.id_hotel,
            id_tipo_acomodacion : params.id_tipo_acomodacion,
            id_tipo_habitacion  : params.id_tipo_habitacion,
            cantidad            : params.cantidad
        });
        setOpenModalConfig(true);
        setIsEdit(false);
    }

    //VALIDACION TIPOS DE HABITACION
    function validateTipoHabitacion(params) {
        const tipoSeleccionado = tipoHabitacion.find(item => item.id == params);
       
        setData({
            ...data,
            id_tipo_habitacion : params
        });

        const acomodacionesPorTipo = {
            'Estandar': ['Sencilla', 'Doble'],
            'Junior'  : ['Triple', 'Cuadruple'],
            'Suite'   : ['Sencilla', 'Doble', 'Triple'],
        };

        const permitidos = acomodacionesPorTipo[tipoSeleccionado.nombre] || [];
        setFiltroAcomodaciones(acomodacioes.filter(item => permitidos.includes(item.nombre))); 
    }

    //ENCABEZADO
    function header() {
        return (
            <>
                <header id='header' className='pb-2 pt-2'>
                        <img src="./images/logo_decameron.png" alt="logo" />
                </header>
                <div className='text-center flex justify-between'>
                    <h1 className='font-bold'>Hoteles</h1>
                    <Button severity='success' label="Registrar Hotel" onClick={() => {setModal(true), getCiudades(), setIsEdit(false)}} />
                </div>
            </>
        )
        
    }

    //ACCIONES TABLA HOTELES
    const actions = (rowData) => {
        return (
            <>
            <div className='flex justify-center'>
                <Button severity='info' icon='pi pi-pencil' tooltip='Editar Hotel' outlined className="p-button-rounded p-button-info mr-2" onClick={() => { editHotel(rowData); setIsEdit(true) }}/>
                <Button severity='help' icon='pi pi-spin pi-cog' tooltip='Registrar Tipo Habitación' outlined className="p-button-rounded p-button-help mr-2" onClick={() => {setData({id_hotel: rowData.id}); setOpenModalConfig(true)}}/>
                <Button severity='danger' icon='pi pi-trash' tooltip='Eliminar Hotel' outlined className="p-button-rounded p-button-danger mr-2" onClick={() => deleteHotel(rowData.id)}/>
            </div>
            </>
        )
    }

    //ACCIONES TABLA ACOMODACIONES
    const actionsDetalles = (rowData) => {
        return (
            <>
            <div className='flex justify-center'>
                <Button severity='info' icon='pi pi-pencil' tooltip='Editar Acomodación' outlined className="p-button-rounded p-button-info mr-2" onClick={() => { editAcomodacion(rowData); setIsEdit(true) }}/>
                {!rowData.deleted_at &&(
                    <Button severity='danger' icon='pi pi-trash' tooltip='Eliminar Acomodación' outlined className="p-button-rounded p-button-danger mr-2" onClick={() => deleteAcomodacion(rowData.id)}/>
                )}
                {rowData.deleted_at &&(
                    <Button severity='success' icon='pi pi-check' tooltip='Reactivar Acomodación' outlined className="p-button-rounded p-button-success mr-2" onClick={() => deleteAcomodacion(rowData.id)}/>
                )}
            </div>
            </>
        )
    }
   
    // FRONT DE COMPONENTE
    return (
        <>
            <DataTable value={infoDatatable?.data} 
                    header={header} tableClassName='text-nowrap' 
                    emptyMessage='No hay Información disponible'>
                <Column align={'center'} header='Hotel' field='nombre'/>
                <Column align={'center'} header='Dirección'field='direccion' />
                <Column align={'center'} header='Ciudad' field='ciudades.nombre'/>
                <Column align={'center'} header='NIT' field='nit'/>
                <Column align={'center'} header='Número Habitaciones' field='numero_hab' />
                <Column align={'center'} header='Estado' field={item => item.deleted_at ? 'Inactivo' : 'Activo' }/>
                <Column align={'center'} header='Configurar Hotel' body={actions} />
            </DataTable>

            {modal && (
                <>
                    <Dialog visible={modal} onHide={() => {setModal(false), reset()}} header='Registro Hotel'>
                        <div className='grid grid-cols-2 gap-4 p-4'>
                            <div className='flex flex-col gap-2 '>
                                <label htmlFor="username" className='font-bold'>Nombre Hotel</label>
                                <InputText 
                                    type='text' 
                                    placeholder='Nombre...'
                                    value={data.nombre}
                                    required
                                    onChange={(e) => setData({...data, nombre : e.target.value})}></InputText>
                            </div>
                            <div className='flex flex-col gap-2 '>
                                <label htmlFor="direccion" className='font-bold'>Dirección Hotel</label>
                                <InputText 
                                    type='text' 
                                    placeholder='Dirección...' 
                                    value={data.direccion}
                                    required
                                    onChange={(e) => setData({...data, direccion : e.target.value})}></InputText>
                            </div>
                            <div className='flex flex-col gap-2 '>
                                <label htmlFor="ciudad" className='font-bold'>Ciudad</label>
                                <Dropdown
                                    showClear
                                    filter
                                    value={data.id_ciudad}
                                    options={ciudades}
                                    optionLabel='nombre'
                                    optionValue='id'
                                    required
                                    onChange={(e) => setData({...data, id_ciudad : e.value})}
                                />
                            </div>
                            <div className='flex flex-col gap-2 '>
                                <label htmlFor="nit" className='font-bold'>NIT</label>
                                <InputText 
                                    type='number' 
                                    placeholder='NIT...' 
                                    value={data.nit} 
                                    required
                                    onChange={(e) => setData({...data, nit : e.target.value})}></InputText>
                            </div>
                            <div className='flex flex-col gap-2 '>
                                <label htmlFor="habitacion" className='font-bold'>Cantidad Habitaciones</label>
                                <InputNumber 
                                    value={data.numero_hab} 
                                    required
                                    onChange={(e) => setData({...data, numero_hab : e.value})}/>
                            </div>
                        </div>
                        <div className='col-span-2 flex flex-row gap-2 justify-center'>
                            <Button severity='success' label={!isEdit ? 'Crear' : 'Actualizar' } onClick={() => {submit(data)}}/>
                            <Button severity='danger' label='Cancelar' onClick={() => {setModal(false), reset()}}/>
                        </div>
                    </Dialog>
                </>

            )}

            {openModalConfig && (
                <>
                    <Dialog visible={openModalConfig} onHide={() => {setOpenModalConfig(false), reset()}} header='Configurar Hotel'>
                    <div className='grid grid-cols-2 gap-4 p-4'>
                            <div className='flex flex-col gap-2 '>
                                <label htmlFor="habitacion" className='font-bold'>Cantidad Habitaciones</label>
                                <InputNumber 
                                    value={data.cantidad} 
                                    required
                                    onChange={(e) => setData({...data, cantidad : e.value})}/>
                            </div>
                            <div className='flex flex-col gap-2 '>
                                <label htmlFor="ciudad" className='font-bold'>Tipo de Habitación</label>
                                <Dropdown
                                    showClear
                                    filter
                                    value={data.id_tipo_habitacion}
                                    options={tipoHabitacion}
                                    optionLabel='nombre'
                                    optionValue='id'
                                    required
                                    onChange={(e) => {validateTipoHabitacion(e.value)}}
                                />
                            </div>
                            <div className='flex flex-col gap-2 '>
                                <label htmlFor="ciudad" className='font-bold'>Acomodación</label>
                                <Dropdown
                                    showClear
                                    filter
                                    value={data.id_tipo_acomodacion}
                                    options={filtroAcomodaciones}
                                    optionLabel='nombre'
                                    optionValue='id'
                                    required
                                    onChange={(e) => setData({...data, id_tipo_acomodacion : e.value})}
                                />
                            </div>
                        </div>
                        <div className='col-span-2 flex flex-row gap-2 justify-center'>
                            <Button severity='success' label={!isEdit ? 'Crear' : 'Actualizar' } onClick={() => {saveAcomodacion(data)}}/>
                            <Button severity='danger' label='Cancelar' onClick={() => {setOpenModalConfig(false), reset()}}/>
                        </div>
                    </Dialog>
                </>
            )}

            <DataTable value={infoAcomodaciones?.data} 
                    header={
                            <div className='text-center flex justify-between mt-8'>
                                <h1 className='font-bold'>Detalle Acomodación Hoteles</h1>
                            </div>
                        } 
                    tableClassName='text-nowrap' 
                    emptyMessage='No hay Información disponible'>
                <Column align={'center'} header='Hotel' field={item => `${item.hotel?.nombre} - ${item.hotel?.ciudades?.nombre}`}/>
                <Column align={'center'} header='Dirección'field='hotel.direccion' />
                <Column align={'center'} header='Tipo Habitación' field='habitaciones.nombre'/>
                <Column align={'center'} header='Acomodación' field='acomodaciones.nombre'/>
                <Column align={'center'} header='Cantidad' field='cantidad'/>
                <Column align={'center'} showFilterMenu={false} filter header='Estado' field={item => item.deleted_at ? 'Inactivo' : 'Activo'} />
                <Column align={'center'} header='Acciones' body={actionsDetalles} />
            </DataTable>
        </>
    );
}