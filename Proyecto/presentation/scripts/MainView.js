const { productosBase } = window;

const { dialog } = require('electron').remote || require('@electron/remote');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const app = Vue.createApp({
  data() {
    return {
      productos: JSON.parse(localStorage.getItem('productos')) || [],
      nuevoProducto: {
        id: '',
        nombre: '',
        categoria: '',
        precioCaja30: '',
        stock: '',
        stockMinimo: '',
        proveedores: []
      },
      rutaGuardado: '',
      sugerencias: [],
      mostrarSugerencias: false,
      mostrarErrorCampos: false
    };
  },
  computed: {
    tieneDatosProducto() {
      return this.nuevoProducto.id !== '' || 
             this.nuevoProducto.categoria !== '' || 
             this.nuevoProducto.precioCaja30 !== '' || 
             this.nuevoProducto.stock !== '' || 
             this.nuevoProducto.stockMinimo !== '';
    }
  },
  methods: {
    agregarProducto() {
      if (
        this.nuevoProducto.stock === ''
      ) {
        this.mostrarErrorTemporal('Debe ingresar el número de cajas.');
        this.productoBloqueado = false;
        return;
      }

      if (
        !this.nuevoProducto.id ||
        !this.nuevoProducto.categoria ||
        !this.nuevoProducto.precioCaja30
      ) {
        this.mostrarErrorTemporal('Por favor completa todos los campos del producto.');
        this.productoBloqueado = false;
        return;
      }

      const producto = { ...this.nuevoProducto };
      producto.proveedores = producto.proveedores || [];
      this.productos.push(producto);
      this.guardarLocal();
      this.borrarCamposProducto();
    },

    mostrarErrorTemporal(mensaje) {
      const popup = document.getElementById('popupError');
      popup.textContent = mensaje;
      popup.classList.add('visible');
      setTimeout(() => {
        popup.classList.remove('visible');
      }, 3000);
    },

    buscarSugerencias() {
      const texto = this.nuevoProducto.id.toLowerCase();
      this.sugerencias = productosBase.filter(p =>
        p.id.toLowerCase().includes(texto) ||
        p.nombre.toLowerCase().includes(texto)
      );
      this.mostrarSugerencias = true;
    },

    seleccionarProducto(producto) {
      this.nuevoProducto = {
        id: producto.id,
        nombre: producto.nombre,
        categoria: producto.categoria,
        precioCaja30: producto.precioCaja30,
        stock: '',
        stockMinimo: producto.stockMinimo,
        proveedores: producto.proveedores || []
      };
      this.productoBloqueado = false;
      this.mostrarSugerencias = false;
      this.sugerencias = [];
    },

    ocultarSugerencias() {
      setTimeout(() => {
        this.mostrarSugerencias = false;
      }, 200);
    },

    borrarCamposProducto() {
      this.nuevoProducto = {
        id: '',
        nombre: '',
        categoria: '',
        precioCaja30: '',
        stock: '',
        stockMinimo: '',
        proveedores: []
      };
      this.productoBloqueado = false;
    },

    eliminarProducto(index) {
      this.productos.splice(index, 1);
      this.guardarLocal();
    },

    exportarDatos() {
      const result = dialog.showOpenDialogSync({
        title: 'Selecciona una carpeta para exportar los datos',
        properties: ['openDirectory']
      });
      
      if (!result || result.length === 0) {
        return; // Usuario canceló la selección de carpeta
      }

      try {
        const rutaSeleccionada = result[0];
        const productosParaExportar = this.productos.map(p => ({
          id: p.id,
          nombre: p.nombre,
          categoria: p.categoria,
          precioCaja30: p.precioCaja30,
          stock: p.stock,
          stockMinimo: p.stockMinimo,
          proveedores: p.proveedores.map(prov => `${prov.nombre} (${prov.leadTime} días)`).join(', ')
        }));

        const ws = xlsx.utils.json_to_sheet(productosParaExportar);
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'Productos');

        const nombreArchivo = path.join(rutaSeleccionada, 'productos_exportados.xlsx');
        xlsx.writeFile(wb, nombreArchivo);

        alert('✅ Datos exportados con éxito a:\n' + rutaSeleccionada);
      } catch (error) {
        console.error('❌ Error al exportar:', error);
        alert('❌ Ocurrió un error al exportar los datos.');
      }
    },

    guardarLocal() {
      localStorage.setItem('productos', JSON.stringify(this.productos));
    },

    mostrarModal() {
      document.getElementById('modalAcceso').classList.remove('hidden');
      document.getElementById('codigoInput').value = '';
      document.getElementById('mensajeError').textContent = '';
    },

    cerrarModal() {
      document.getElementById('modalAcceso').classList.add('hidden');
    },

    validarCodigo() {
      const codigo = document.getElementById('codigoInput').value;
      if (codigo === 'admin123') {
        window.location.href = 'ContactsView.html';
      } else {
        document.getElementById('mensajeError').textContent = 'Código incorrecto. Acceso denegado.';
      }
    },

    cerrarSesion() {
    localStorage.removeItem('productos');
    localStorage.removeItem('usuarioActual');
    window.location.href = './LoginView.html';
    },

    confirmarCerrarSesion() {
    document.getElementById('modalCerrarSesion').classList.remove('hidden');
    },

   cerrarModalCerrarSesion() {
    document.getElementById('modalCerrarSesion').classList.add('hidden');
}
  }
});

app.mount('#app');
