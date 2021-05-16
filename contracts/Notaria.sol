// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Notaria{
    address public owner;
    uint public documentsCount = 1;

    struct Documento{
        uint id;
        uint precio;
        string nombre;
        bool estado;
    }

    mapping(uint => Documento) public documentos;
    mapping(address => mapping(uint => Documento)) public documentosCliente;
    mapping(address => uint) public totalDocumentosCliente;

    event DocumentoAdded(uint id, uint precio, string nombre, bool estado, address owner);
    event DocumentoComprado(uint id, address owner);
    
    constructor() {
        owner = msg.sender;
    }

    function AddDocumento(uint _precio, string memory _nombre, bool _estado) public payable{
        require(msg.sender == owner, "Funcionalidad solo permitida para el owner");
        require(bytes(_nombre).length > 0, "El nombre debe tener un largo minimo");
        documentos[documentsCount] = Documento(documentsCount, _precio,_nombre,_estado);
        documentsCount++;
        
        emit DocumentoAdded(documentsCount,_precio, _nombre, _estado, msg.sender);
    }
    
    function AddDocumentoCliente(uint _id, uint _precio, string memory _nombre, bool _estado) public {
        documentosCliente[msg.sender][_id] = Documento(_id, _precio, _nombre, _estado);
    }

    function compraDocumento(uint _id) external payable {
        Documento memory _documento = documentos[_id];
        // Valida que el Documento tenga un ID mayor que 0
        require(_documento.id > 0);
        // Requiere que haya suficiente ETH en la transaccion
        require(msg.value >= _documento.precio);
        //Transfiere el precio del Documento
        payable((msg.sender)).transfer(msg.value);
        //Suma 1 al mapping de Documentos x Cliente
        totalDocumentosCliente[msg.sender]++;
        //Agrega el documento comprado al mapping de Documentos Comprados x Cliente
        AddDocumentoCliente(_documento.id, _documento.precio, _documento.nombre, _documento.estado);
        // Dispara el evento
        emit DocumentoComprado(_id, msg.sender);
    }  

    receive() external payable {}

    function GetOwner() public view returns (address){
        return owner;
    }

    modifier isOwner(){
        require(msg.sender == owner);
        _;
    }  
}