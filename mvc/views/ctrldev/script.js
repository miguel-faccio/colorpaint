document.addEventListener('DOMContentLoaded', () => {
    // Dados de exemplo para o gráfico de barras (usuários)
    const usuariosData = {
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'],
        datasets: [{
            label: 'Novos Usuários',
            data: [10, 20, 30, 40, 50],
            backgroundColor: [
                '#007bff', // Azul mais escuro
                '#4e86e4', // Azul médio
                '#96ccff', // Azul claro
                '#b3d9ff', // Azul mais claro
                '#cce6ff'  // Azul muito claro
            ],
            borderColor: '#007bff', // Cor da borda
            borderWidth: 1
        }]
    };

    // Opções para o gráfico de barras (usuários)
    const usuariosOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    // Renderizar o gráfico de barras (usuários)
    const usuariosCtx = document.getElementById('usuarios-chart').getContext('2d');
    const usuariosChart = new Chart(usuariosCtx, {
        type: 'bar',
        data: usuariosData,
        options: usuariosOptions
    });

    // Dados de exemplo para o gráfico de barras (desenhos)
    const desenhosData = {
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'],
        datasets: [{
            label: 'Novos Desenhos',
            data: [5, 15, 10, 25, 20],
            backgroundColor: [
                '#007bff', // Azul mais escuro
                '#4e86e4', // Azul médio
                '#96ccff', // Azul claro
                '#b3d9ff', // Azul mais claro
                '#cce6ff'  // Azul muito claro
            ],
            borderColor: '#007bf7', // Cor da borda
            borderWidth: 1
        }]
    };

    // Opções para o gráfico de barras (desenhos)
    const desenhosOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    // Renderizar o gráfico de barras (desenhos)
    const desenhosCtx = document.getElementById('desenhos-chart').getContext('2d');
    const desenhosChart = new Chart(desenhosCtx, {
        type: 'bar',
        data: desenhosData,
        options: desenhosOptions
    });
});
