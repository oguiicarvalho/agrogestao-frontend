import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <h1 className="logo">AgroGestão</h1>
      <nav className="nav">
        <Link to="/">Início</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/fazenda">Fazenda</Link>
        <Link to="/funcionarios">Funcionários</Link>
        <Link to="/servicos">Serviços</Link>
      </nav>
    </header>
  );
}
