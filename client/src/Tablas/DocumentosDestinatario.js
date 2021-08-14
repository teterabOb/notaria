import React, { Component } from 'react';

class DocumentosDestinatario extends Component {
    constructor(props) {
        super(props)
    }
    
    retornaEstado(idEstado) {
        let estado
        switch (idEstado) {
            case "0":
                estado = "Abierto"
                break;
            case "1":
                estado = "Aceptado"
                break;
            case "2":
                estado = "Finalizado"
                break;
        }
        return estado
    }

    retornaBoton(idEstado) {

        if (idEstado === '0') {
            return (<button type='submit' className='btn btn-outline-primary btn-block'>Aceptar Documento</button>)
        }
        else if (idEstado === '1') {
            return (<button type='submit' className='btn btn-outline-warning btn-block'>Pagar y Finalizar</button>)
        }
        else if (idEstado === '2') {
            return (<button type='submit' enabled="false" className='btn btn-outline-primary btn-block'>Finalizado</button>)
        }
        else {
            return "No funciona"
        }
    }

    retornaTitulo(idEstado) {
        if (idEstado === '0') {
            return (<div className="bg-success p-1 text-white btn-bl"><p className="text-center">Abierto</p></div>)
        }
        else if (idEstado === '1') {
            return (<div className="bg-primary p-1 text-white"><p className="text-center">Aceptado</p></div>)
        }
        else if (idEstado === '2') {
            return (<div className="bg-danger p-1 text-white"><p className="text-center">Finalizado</p></div>)
        }
        else {
            return "No funciona"
        }
    }

    execDocumento(idDocumento, idEstado) {
        if (idEstado == 0) {
            this.props.aceptaDocumento(idDocumento)
        }
        else if (idEstado == 1) {
            this.props.finalizaDocumento(idDocumento)
        }
    }

    render() {
        const cantDocumentos = this.props.documentosDestinatario.length

        if(cantDocumentos > 0){
            return (
                <div className="col-lg-12 mt-3 border border-primary rounded-lg mb-5">
                    <div className="bg-primary row p-3 text-white text-center"><h4>Documentos Recibidos</h4></div>
                    <div className="col-lg-12 pt-2 d-flex">
    
                        {this.props.documentosDestinatario.map((documento, key) => {                                           
                                return (
                                    <div key={key} className="col-lg-2 shadow-lg bg-body rounded p-3 m-2">
                                        {this.retornaTitulo(documento.estado)}
                                        <form className="" id={"notaria-" + documento.id} onSubmit={(event) => {
                                            event.preventDefault()
                                            const idDocumento = event.target.id.value
                                            const idEstado = documento.estado
                                            this.execDocumento(idDocumento, idEstado)
                                        }}>
                                             <div className="m-2">
                                                <label className="form-label">Nombre Documento</label>                                         
                                                <input readOnly type="text" className="form-control" defaultValue={documento.documento.nombre} />
                                            </div>
                                            <div className="m-2">
                                                <label className="form-label">ID Documento</label>
                                                <input name="id" readOnly type="text" className="form-control" defaultValue={documento.id} />
                                            </div>
                                            <div className="m-2">
                                                <label className="form-label">Precio</label>
                                                <input readOnly type="text" className="form-control" defaultValue={documento.precio + " ETH"} />
                                            </div>
                                            <div className="m-2">
                                                <label className="form-label">Destinatario</label>
                                                <input readOnly type="text" className="form-control" defaultValue={documento.destinatario} />
                                            </div>
                                            <div className="m-2">
                                                <label className="form-label">Estado</label>
                                                <input readOnly type="text" className="form-control" defaultValue={this.retornaEstado(documento.estado)} />
                                            </div>

                                            <div className="m-3">
                                                {this.retornaBoton(documento.estado)}
                                            </div>
                                        </form>
                                    </div>
                                )
                      
                        })}
                    </div>
                </div>
            )
        }else{
            return (
                <div className="col-lg-12 mt-3 border border-primary rounded-lg mb-5">
                    <div className="bg-primary row p-2 text-white"><h4>Documentos Emitidos</h4></div>
                    <div className="col-lg-12">
                        <p className="text-center mt-2">No tiene Documentos registrados.</p>
                    </div>
                </div>
            )
        }
    }
}

export default DocumentosDestinatario