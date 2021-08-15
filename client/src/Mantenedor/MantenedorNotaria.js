import React, { Component, useState } from 'react';
import Web3 from 'web3';

class MantenedorNotaria extends Component {
    constructor(props) {
        super(props)          
    }  
    
    retornaPrecioEnETH(precio){
        let web3 = window.web3
        let precioETH = web3.utils.fromWei(precio, 'ether');
        console.log(precioETH) 
        return precioETH;
    }

    render() {
        return (
            <div className="col-lg-12 d-flex justify-content-center">
                
                {this.props.documentos.map((documento, key) => {                    
                    return (                        
                            <form ref="form" id={"notaria-"+ documento.id} key={key} onSubmit={(event) => {
                                event.preventDefault()
                                const id = event.target.id.value
                                const precio = event.target.precio.value
                                const direccion = event.target.direccion.value                                       
                                

                                this.props.addDocumentoNotaria(id, precio, direccion)
                                                            
                            } }>
                                <div className="card border-primary mb-3 mx-2" >
                                    <div className="card-header bg-primary text-white" >{documento.id} # {documento.nombre}</div>
                                    <div className="card-body text-primary">
                                        <h5 className="card-title">Precio realización trámite { this.retornaPrecioEnETH(documento.precio) } ETH </h5>
                                        <p> 
                                        <input
                                            name="id"
                                            defaultValue={documento.id}  
                                            style={{display: 'none' }}                             
                                            />                                   
                                        <input
                                            name="direccion"
                                            type="text"                                        
                                            className="form-control"
                                            placeholder="Dirección Destinatario"                                            
                                            required />
                                        </p>
                                        <p>                                    
                                        <input
                                            name="precio"
                                            type="text"                                            
                                            className="form-control"
                                            placeholder="Monto"                                            
                                            required />
                                        </p>
                                    </div>
                                    <div className="card-footer bg-transparent border-primary d-flex justify-content-center">
                                        <button className="btn btn-primary mx-2" type="submit">Generar Documento</button>
                                    </div>
                                </div>
                            </form>
                    )
                })}

            </div>

        )
    }
}

export default MantenedorNotaria