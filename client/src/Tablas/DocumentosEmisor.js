import React, { Component } from 'react';

class DocumentosEmisor extends Component {
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
    
    retornaPrecioEnETH(precio){
        let web3 = window.web3
        let precioETH = web3.utils.fromWei(precio, 'ether');
        console.log(precioETH) 
        return precioETH;
    }

    render() {
        const cantDocumentos = this.props.documentosEmisor.length

        if (cantDocumentos > 0) {
            return (
                <div className="col-lg-12 mt-2 border border-primary rounded-lg">
                    <div className="bg-primary row p-3 text-white text-center"><h4>Documentos Emitidos</h4></div>
                    <div className="col-lg-12 content w-100">
                        <ul className="list-group">
                            {this.props.documentosEmisor.map((documento, key) => {
                                return (
                                    <li className="list-group-item" key={key}><strong>ID:</strong> {documento.id} -
                                        <strong> Precio:</strong> <label>{ this.retornaPrecioEnETH(documento.precio)}</label> <strong>ETH</strong> - 
                                        <strong> Destinatario:</strong> <label className="text-danger">{documento.destinatario}</label>  -
                                        <strong> Estado:</strong> {this.retornaEstado(documento.estado)} -
                                        <strong> Documento:</strong> {documento.documento.nombre}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="col-lg-12 mt-2 border border-primary rounded-lg">
                    <div className="bg-primary row p-2 text-white"><h4>Documentos Emitidos</h4></div>
                    <div className="col-lg-12">
                        <p className="text-center mt-2">No tiene Documentos emitidos registrados.</p>
                    </div>
                </div>
            )
        }
    }
}

export default DocumentosEmisor