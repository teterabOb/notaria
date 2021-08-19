import React, { Component } from 'react';
import MantenedorNotaria from './Mantenedor/MantenedorNotaria';
import DocumentosEmisor from './Tablas/DocumentosEmisor';
import DocumentosDestinatario from './Tablas/DocumentosDestinatario';
import Web3 from 'web3';

class Main extends Component {
    constructor(props) {
        super(props)

        this.state = {
            estado: 0,
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({ estado: event.target.value })
        
    }
    
    retornaPrecioEnETH(precio){
        let web3 = window.web3
        let precioETH = web3.utils.fromWei(precio, 'ether');
        
        return precioETH;
    }

    render() {

        let account = this.props.account
        let owner = this.props.owner

        if (account === owner) {
            return (
                <div className="col-lg-12" id="content">
                    <div className="col-lg-6 mt-2">
                        <h1>Nuevo Documento</h1>
                        <form onSubmit={(event) => {
                            event.preventDefault()
                            const nombre = this.txtNombre.value
                            const precio = this.txtPrecio.value
                            const estado = this.state.estado
                            this.props.nuevoDocumento(precio, nombre, estado)
                        }}>
                            <div className="form-group mr-sm-2">
                                <input
                                    id="txtNombre"
                                    type="text"
                                    ref={(input) => { this.txtNombre = input }}
                                    className="form-control"
                                    placeholder="Nombre Documento"
                                    required />
                            </div>

                            <div className="form-group mr-sm-2">
                                <input
                                    id="txtPrecio"
                                    type="text"
                                    ref={(input) => { this.txtPrecio = input }}
                                    className="form-control"
                                    placeholder="Precio Documento"
                                    required />
                            </div>

                            <div className="form-group mr-sm-2">
                                <select className="form-control"
                                    value={this.state.estado}
                                    onChange={this.handleChange}>

                                    <option value="0">Activo</option>
                                    <option value="1">Inactivo</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-primary">Agregar Documento </button>
                        </form>
                    </div>
                </div>
            )
        }

        return (

            <div className="row mx-2" id="content">
                <div className="col-lg-12">
                </div>

                <div className="col-lg-12">
                    <MantenedorNotaria
                        documentos={this.props.documentos}
                        addDocumentoNotaria={this.props.addDocumentoNotaria}
                    />
                </div>
                <div className="col-lg-12">
                    <DocumentosEmisor
                        documentosEmisor={this.props.documentosEmisor}
                    />
                </div>


                <div className="col-lg-12">
                    <DocumentosDestinatario
                        documentosDestinatario={this.props.documentosDestinatario}
                        aceptaDocumento={this.props.aceptaDocumento}
                        finalizaDocumento={this.props.finalizaDocumento}

                    />
                </div>
            </div>


        )

    }
}

export default Main