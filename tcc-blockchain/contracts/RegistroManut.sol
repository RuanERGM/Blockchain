// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RegistroManutencao {

    struct Manutencao {
        uint256 id;
        string maquina;
        string descricao;
        string prioridade;
        string operador;
        uint256 timestamp;
    }

    Manutencao[] private manutencoes;

    event ManutencaoRegistrada(
        uint256 id,
        string maquina,
        string descricao,
        string prioridade,
        string operador,
        uint256 timestamp
    );

    function registrarManutencao(
        string memory _maquina,
        string memory _descricao,
        string memory _prioridade,
        string memory _operador
    ) public {

        uint256 id = manutencoes.length;

        Manutencao memory novaManutencao = Manutencao(
            id,
            _maquina,
            _descricao,
            _prioridade,
            _operador,
            block.timestamp
        );

        manutencoes.push(novaManutencao);

        emit ManutencaoRegistrada(
            id,
            _maquina,
            _descricao,
            _prioridade,
            _operador,
            block.timestamp
        );
    }

    function listarManutencao(uint256 index)
        public
        view
        returns (
            uint256 id,
            string memory maquina,
            string memory descricao,
            string memory prioridade,
            string memory operador,
            uint256 timestamp
        )
    {
        Manutencao memory m = manutencoes[index];

        return (
            m.id,
            m.maquina,
            m.descricao,
            m.prioridade,
            m.operador,
            m.timestamp
        );
    }

    function totalManutencoes() public view returns (uint256) {
        return manutencoes.length;
    }
}