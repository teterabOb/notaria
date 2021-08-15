import React, { Component } from "react";
import PresupuestoContract from "./contracts/Presupuesto.json";
import CLPTokenContract from "./contracts/CLPToken.json";
import NotariaContract from "./contracts/Notaria.json";
import Web3 from 'web3';
import Navbar from './Navbar';
import Main from './Main';

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      documentos: [],
      documentosEmisor: [],
      documentosDestinatario: [],
      montoAutorizado: 0,
      loading: true,
      owner: "0x0000000000000000000000000000000000000000",
      cantTokenUsuario: 0,
      cantTokenContrato: 0,

    }

    //Se debe bindear para que react sepa que al enviar la funcion
    // al otro js esta siendo la funcion ya creada
    this.nuevoDocumento = this.nuevoDocumento.bind(this)
    this.addDocumentoNotaria = this.addDocumentoNotaria.bind(this)
    this.aceptaDocumento = this.aceptaDocumento.bind(this)
    this.finalizaDocumento = this.finalizaDocumento.bind(this)
  }

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockChainData();
  }

  async loadWeb3() {

    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()

      await window.web3.currentProvider.on('accountsChanged', (accounts) => {

        this.setState({
          account: accounts[0]

        }, () => {

        })

        this.loadBlockChainData()
      });
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)

    }
    else {

    }

  }

  setDefaultVariables() {
    this.setState({ documentos: [] })
    this.setState({ documentosPorCliente: [] })
    this.setState({ documentosEmisor: [] })
    this.setState({ documentosDestinatario: [] })
  }

  async loadBlockChainData() {
    const web3 = window.web3

    //Carga cuenta
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId();

    const networkDataPresupuesto = PresupuestoContract.networks[networkId]
    const networkDataNotaria = NotariaContract.networks[networkId]
    const networkDataCLPToken = CLPTokenContract.networks[networkId]


    if (networkDataNotaria) {

      //Limpia los documentos cliente
      this.setDefaultVariables();

      const presupuesto = new web3.eth.Contract(PresupuestoContract.abi, networkDataPresupuesto.address);
      const notaria = new web3.eth.Contract(NotariaContract.abi, networkDataNotaria.address);
      const CLPToken = new web3.eth.Contract(CLPTokenContract.abi, networkDataCLPToken.address);

      this.setState({ presupuesto, notaria })
      //Las funciones call leen data
      const regionesCount = await presupuesto.methods.RegionCount().call()
      const documentosCount = await notaria.methods.documentsCount().call()
      const owner = await notaria.methods.GetOwner().call()

      this.setState({ regionesCount, documentosCount, owner: owner })

      const totalDocumentosEmisor = await notaria.methods.totalDocumentosEmisor(this.state.account).call()
      const totalDocumentosDestinatario = await notaria.methods.totalDocumentosDestinatario(this.state.account).call()

      //Documentos Emisor
      for (var a = 1; a <= totalDocumentosEmisor; a++) {
        const doc = await notaria.methods.documentosNotariaEmisor(this.state.account, a).call()
        this.setState({
          documentosEmisor: [...this.state.documentosEmisor, doc]
        })
      }

      //Documentos Destinatario
      for (var b = 1; b <= totalDocumentosDestinatario; b++) {
        const doc = await notaria.methods.documentosNotariaDestinatario(this.state.account, b).call()
        this.setState({
          documentosDestinatario: [...this.state.documentosDestinatario, doc]
        })
      }

      //Arreglo para listas documentos
      for (var j = 1; j <= documentosCount; j++) {
        const documento = await notaria.methods.documentos(j).call()
        this.setState({
          documentos: [...this.state.documentos, documento]
        })
      };

      const tokensUser = await CLPToken.methods.balanceOf(this.state.account).call()
      const tokensContrato = await CLPToken.methods.balanceOf(notaria._address).call()

      if (tokensUser != 'undefined') {
        let tokenString = (tokensUser).toString()
        { this.setState({ cantTokenUsuario: web3.utils.fromWei(tokenString, 'ether') }) }
      }
      if (tokensContrato != 'undefined') {
        let tokenString = (tokensContrato).toString()
        { this.setState({ cantTokenContrato: web3.utils.fromWei(tokenString, 'ether') }) }
      }

      console.log(this.state.documentosDestinatario)

      this.setState({ loading: false })

    } else {
      this.setState({ loading: false })
      this.setDefaultVariables()
    }
  }

  nuevoDocumento(precio, nombre, estado) {
    this.setState({ loading: true })
    let web3 = window.web3
    let precioETH = web3.utils.toWei(precio, 'ether');

    this.state.notaria.methods.AddDocumento(precioETH, nombre, estado).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      });
  }

  async aceptaDocumento(id) {
    let web3 = window.web3

    await this.state.notaria.methods.AceptaDocumentoNotaria(id).send({ from: this.state.account })
      .on('error', (error) => {
        console.log('error')
        console.log(error)
      })
      .once('receipt', (receipt) => {
        this.loadBlockChainData()
      })
  };

  async finalizaDocumento(id) {
    let docDestinatario = await this.state.notaria.methods.documentosNotariaDestinatario(this.state.account, id).call()
    let precioDocumento = parseInt(docDestinatario.documento.precio, 10)
    let precioFinalizacion = parseInt(docDestinatario.precio,10)
    let precioFinal = (precioDocumento + precioFinalizacion)
      
    await this.state.notaria.methods.FinalizaDocumentoNotaria(id).send({ from: this.state.account, value: precioFinal })
      .on('error', (error) => {

      })
      .once('receipt', (receipt) => {
        this.loadBlockChainData()
      })
      
  };

  async addDocumentoNotaria(id, precio, destinatario) {
    let web3 = window.web3
    let precioETH = web3.utils.toWei(precio, 'ether');
    await this.state.notaria.methods.AddDocumentoNotaria(id, precioETH, destinatario).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.loadBlockChainData()
      })
      .on('confirmation', (confNumber, receipt, latestBlockHash) => {

      })
      .on('error', (error) => {

      })
  }

  render() {

    return (
      <div className="bg-light pt-5">
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row mb-3">
            <div className="col-lg-12 d-flex justify-content-center">
              <div className="col-lg-4 bg-dark mx-2 p-5 border rounded ">
                <blockquote className="blockquote text-center text-white">
                  <p className="mb-2">Tenemos 10.000 Chilean Peso Token para los primeros 10.000 documentos finalizados de manera satisfactoria. Se regalarán
                    10 por trámite finalizado con éxito. Mantente atento a nuestras redes porque podrás disfrutar de múltiples beneficios.</p>
                  <footer className="blockquote-footer">Atte. <cite title="Source Title">Notaria Digital de Chile</cite></footer>
                  <p className="mb-2 mt-2 border border-white rounded bg-primary pt-2"><label>CLPT Disponibles: {this.state.cantTokenContrato}</label></p>
                  <p className="mb-0 border border-white bg-primary pt-"><label>CLPT: {this.state.cantTokenUsuario}</label></p>
                </blockquote>
              </div>
              <div className="col-lg-4 bg-dark mx-2 p-3 border rounded ">
                <blockquote className="blockquote text-white">
                  <p className="mb-2">Las instrucciones para poder utilizar la Notaria son: </p>
                  <p>Generación de Documento</p>
                  <ol>
                    <li> Escoge un Documento disponible. </li>
                    <li> Ingresa la dirección del destinatario para el trámite.</li>
                    <li> Ingresa el precio acordado en ETHER con el destinatario.</li>
                    <li> Click en Genrar Documento.</li>
                    <li> El destinatario visualizará el documento en el menu de Documentos Recibidos para continuar con el trámite.</li>
                  </ol>
                </blockquote>
                <blockquote className="blockquote text-white">
                  <p className="mb-2">Si alguien ha generado un Documento y eres el destinatario debes hacer lo siguiente: </p>
                  
                  <ol>
                    <li> Visualiza el listado de Documentos Recibidos. </li>
                    <li> Según el Estado del trámite deberás primero Aceptarlo.</li>
                    <li> Una vez aceptado y deseas finalizar el Documento pagarás por el precio acordado mas el precio del documento.</li>                                        
                  </ol>
                </blockquote>
              </div>

            </div>
          </div>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              {this.state.loading
                ? <div className="spinner-grow" role="status">
                  <span className="sr-only">Loading...</span></div>
                : <Main
                  regiones={this.state.regiones}
                  owner={this.state.owner}
                  account={this.state.account}
                  documentos={this.state.documentos}
                  documentosPorCliente={this.state.documentosPorCliente}
                  documentosEmisor={this.state.documentosEmisor}
                  documentosDestinatario={this.state.documentosDestinatario}
                  nuevaRegion={this.nuevaRegion}
                  nuevoDocumento={this.nuevoDocumento}
                  compraDocumento={this.compraDocumento}
                  aceptaDocumento={this.aceptaDocumento}
                  finalizaDocumento={this.finalizaDocumento}
                  addDocumentoNotaria={this.addDocumentoNotaria}
                />}

            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
