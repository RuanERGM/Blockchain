// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MaintenanceRegistry
 * @dev Sistema de rastreabilidade de manutenções em equipamentos industriais.
 * Cada manutenção é registrada na blockchain, garantindo integridade e transparência.
 */
contract MaintenanceRegistry {
    struct Maintenance {
        uint256 id;
        string machineName;
        string description;
        string technician;
        uint256 timestamp;
    }

    uint256 private nextId = 1;
    mapping(uint256 => Maintenance) public maintenances;

    event MaintenanceRegistered(
        uint256 indexed id,
        string machineName,
        string description,
        string technician,
        uint256 timestamp
    );

    /**
     * @dev Registra uma nova manutenção
     */
    function registerMaintenance(
        string memory _machineName,
        string memory _description,
        string memory _technician
    ) public {
        maintenances[nextId] = Maintenance(
            nextId,
            _machineName,
            _description,
            _technician,
            block.timestamp
        );

        emit MaintenanceRegistered(
            nextId,
            _machineName,
            _description,
            _technician,
            block.timestamp
        );

        nextId++;
    }

    /**
     * @dev Retorna os dados de uma manutenção pelo ID
     */
    function getMaintenance(uint256 _id)
        public
        view
        returns (Maintenance memory)
    {
        return maintenances[_id];
    }
}