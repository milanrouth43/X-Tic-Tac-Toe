terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# ================================
# RESOURCE GROUP
# ================================
resource "azurerm_resource_group" "rg" {
  name     = var.azure_resource_group
  location = var.azure_region
}

# ================================
# VIRTUAL NETWORK (VPC)
# ================================
resource "azurerm_virtual_network" "vnet" {
  name                = "main-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = var.azure_region
  resource_group_name = azurerm_resource_group.rg.name
}

# ================================
# SUBNETS
# ================================
resource "azurerm_subnet" "web_subnet" {
  name                 = "web-subnet"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.0.0/24"]
}

resource "azurerm_subnet" "db_subnet" {
  name                 = "db-subnet"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

# ================================
# WEB NSG
# ================================
resource "azurerm_network_security_group" "web_nsg" {
  name                = "web-tier-nsg"
  location            = var.azure_region
  resource_group_name = azurerm_resource_group.rg.name

  security_rule {
    name                       = "Allow-HTTPS"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  tags = {
    Tier = "Web"
  }
}

# ================================
# DB NSG
# ================================
resource "azurerm_network_security_group" "db_nsg" {
  name                = "db-tier-nsg"
  location            = var.azure_region
  resource_group_name = azurerm_resource_group.rg.name

  security_rule {
    name                       = "Allow-Postgres"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "5432"
    source_address_prefix      = "10.0.0.0/24"
    destination_address_prefix = "*"
  }

  tags = {
    Tier = "Database"
  }
}

# ================================
# ASSOCIATE NSG TO SUBNET
# ================================
resource "azurerm_subnet_network_security_group_association" "web_assoc" {
  subnet_id                 = azurerm_subnet.web_subnet.id
  network_security_group_id = azurerm_network_security_group.web_nsg.id
}

resource "azurerm_subnet_network_security_group_association" "db_assoc" {
  subnet_id                 = azurerm_subnet.db_subnet.id
  network_security_group_id = azurerm_network_security_group.db_nsg.id
}
