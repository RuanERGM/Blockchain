// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RegistroManutencao {
    struct Manutencao {
        string descricao;
        uint256 data;
        string prioridade;
        string nomeOperador; // nome salvo no momento do registro
    }

    Manutencao[] public manutencoes;

    event ManutencaoRegistrada(
        uint256 index,
        string descricao,
        uint256 data,
        string prioridade,
        string nomeOperador
    );

    function registrar(
        string memory descricao,
        uint256 data,
        string memory prioridade,
        string memory nomeOperador
    ) public {
        manutencoes.push(
            Manutencao(descricao, data, prioridade, nomeOperador)
        );

        emit ManutencaoRegistrada(
            manutencoes.length - 1,
            descricao,
            data,
            prioridade,
            nomeOperador
        );
    }

    function listarManutencao(uint256 index)
        public
        view
        returns (
            string memory descricao,
            uint256 data,
            string memory prioridade,
            string memory nomeOperador
        )
    {
        Manutencao memory m = manutencoes[index];
        return (m.descricao, m.data, m.prioridade, m.nomeOperador);
    }

    function totalManutencoes() public view returns (uint256) {
        return manutencoes.length;
    }
}