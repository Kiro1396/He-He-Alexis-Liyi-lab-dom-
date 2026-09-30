document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("inscripcion");
    const campoSede = document.getElementById("campo-sede");
    const sedeSelect = document.getElementById("sede");
    const comentarios = document.getElementById("comentarios");
    const contadorComentarios = document.getElementById("contador-comentarios");
    const confirmacionSeccion = document.getElementById("confirmacion");
    const contrasenaInput = document.getElementById("contrasena");
    const barraFuerza = document.querySelector(".fuerza-barra span");

    const tocados = new Set(); // Registra los campos que el usuario ya visitó

    // 1. OBJETO DE REGLAS DE VALIDACIÓN
    const reglas = {
        nombre: v => {
            if (!v.trim()) return "Escribe tu nombre y apellido.";
            const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+(\s+[a-zA-ZáéíóúÁÉÍÓÚñÑ]+)+$/;
            if (!regex.test(v.trim())) return "Debe contener al menos dos palabras (solo letras).";
            if (v.length < 5 || v.length > 60) return "Debe tener entre 5 y 60 caracteres.";
            return true;
        },
        cedula: v => {
            const regex = /^([1-9]|1[0-3]|PE|E|N)-\d{1,4}-\d{1,6}$/;
            return regex.test(v.trim()) || "Usa el formato 8-123-4567.";
        },
        correo: v => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(v.trim()) || "Usa un correo como nombre@dominio.com.";
        },
        celular: v => {
            const regex = /^6\d{3}-?\d{4}$/;
            return regex.test(v.trim()) || "El celular debe tener 8 dígitos y empezar con 6.";
        },
        fechaNacimiento: v => {
            if (!v) return "Introduce tu fecha de nacimiento.";
            const fechaInput = new Date(v);
            const hoy = new Date();
            if (fechaInput > hoy) return "La fecha de nacimiento no puede ser futura.";
            
            const limite = new Date();
            limite.setFullYear(limite.getFullYear() - 16);
            return fechaInput <= limite || "Debes tener al menos 16 años.";
        },
        curso: v => v !== "" || "Elige un curso.",
        modalidad: () => {
            const radioSeleccionado = form.querySelector('input[name="modalidad"]:checked');
            return radioSeleccionado ? true : "Elige una modalidad.";
        },
        sede: v => {
            const radioPresencial = form.querySelector('input[name="modalidad"]:checked')?.value === 'presencial';
            if (radioPresencial && !v) return "Elige una sede.";
            return true;
        },
        contrasena: v => {
            if (v.length < 8) return "Mínimo 8 caracteres.";
            if (!/[A-Z]/.test(v)) return "Te falta: una mayúscula.";
            if (!/[a-z]/.test(v)) return "Te falta: una minúscula.";
            if (!/\d/.test(v)) return "Te falta: un número.";
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(v)) return "Te falta: un símbolo.";
            return true;
        },
        confirmarContrasena: v => {
            return v === contrasenaInput.value || "Las contraseñas no coinciden.";
        },
        terminos: () => {
            return form.elements["terminos"].checked || "Debes aceptar los términos.";
        }
    };

    // 2. FUNCIÓN ÚNICA DE VALIDACIÓN DE UN CAMPO
    function validarCampo(input) {
        const name = input.name;
        if (!reglas[name]) return true;

        const valor = input.type === "checkbox" ? input.checked : input.value;
        const resultado = reglas[name](valor);
        const valido = resultado === true;

        const errorElemento = document.getElementById(`${name}-error`);
        
        if (input.type === "radio") {
            const radios = form.querySelectorAll(`input[name="${name}"]`);
            radios.forEach(r => r.setAttribute("aria-invalid", String(!valido)));
        } else {
            input.setAttribute("aria-invalid", String(!valido));
        }

        if (errorElemento) {
            errorElemento.textContent = valido ? "" : resultado;
        }

        return valido;
    }

    // 3. EVENTOS: PRIMERO AL SALIR (BLUR) Y EN VIVO (INPUT)
    form.addEventListener("blur", (e) => {
        let name = e.target.name;
        if (!name || !reglas[name]) return;
        
        tocados.add(name);
        validarCampo(e.target);
    }, true); // Fase de captura para atrapar el evento blur

    form.addEventListener("input", (e) => {
        let name = e.target.name;
        if (!name) return;

        if (tocados.has(name)) {
            validarCampo(e.target);
        }

        // Revalidar confirmación si cambia la contraseña principal
        if (name === "contrasena" && tocados.has("confirmarContrasena")) {
            validarCampo(form.elements["confirmarContrasena"]);
        }

        // Medidor de fuerza en tiempo real
        if (name === "contrasena") {
            actualizarFuerzaClave(e.target.value);
        }
    });

    // Control especial para los Radios y Checkbox (cambian con "change")
    form.addEventListener("change", (e) => {
        if (e.target.name === "modalidad") {
            tocados.add("modalidad");
            validarCampo(e.target);

            // Mostrar/Ocultar sede dinámicamente
            if (e.target.value === "presencial") {
                campoSede.hidden = false;
            } else {
                campoSede.hidden = true;
                sedeSelect.value = ""; // Limpia el valor
                tocados.delete("sede"); // Olvida si fue tocado
                validarCampo(sedeSelect);
            }
        }
        if (e.target.name === "terminos") {
            tocados.add("terminos");
            validarCampo(e.target);
        }
    });

    // 4. MEDIDOR DE FUERZA DE CONTRASEÑA
    function actualizarFuerzaClave(clave) {
        let puntos = 0;
        if (clave.length >= 8) puntos++;
        if (/[A-Z]/.test(clave)) puntos++;
        if (/[a-z]/.test(clave)) puntos++;
        if (/\d/.test(clave)) puntos++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(clave)) puntos++;

        let ancho = "0%";
        let color = "#eee";

        if (puntos > 0 && puntos <= 2) { ancho = "33%"; color = "#d9534f"; }
        else if (puntos > 2 && puntos <= 4) { ancho = "66%"; color = "#f0ad4e"; }
        else if (puntos === 5) { ancho = "100%"; color = "#5cb85c"; }

        barraFuerza.style.width = ancho;
        barraFuerza.style.backgroundColor = color;
    }

    // 5. CONTADOR EN VIVO PARA COMENTARIOS
    comentarios.addEventListener("input", () => {
        const total = comentarios.value.length;
        contadorComentarios.textContent = `${total} / 200`;

        contadorComentarios.classList.remove("alerta", "limite");
        if (total >= 180 && total < 200) {
            contadorComentarios.classList.add("alerta");
        } else if (total === 200) {
            contadorComentarios.classList.add("limite");
        }
    });

    // 6. ENVÍO DEL FORMULARIO (SUBMIT)
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Evita recargar la página

        const camposAValidar = [
            form.elements["nombre"],
            form.elements["cedula"],
            form.elements["correo"],
            form.elements["celular"],
            form.elements["fechaNacimiento"],
            form.elements["curso"]
        ];

        // Validar radio de modalidad manualmente
        let esModalidadValida = validarCampo(form.querySelector('input[name="modalidad"]'));
        
        // Si es presencial, añadimos la sede a la lista de validación obligatoria
        const esPresencial = form.querySelector('input[name="modalidad"]:checked')?.value === 'presencial';
        if (esPresencial) {
            camposAValidar.push(sedeSelect);
        }

        camposAValidar.push(form.elements["contrasena"]);
        camposAValidar.push(form.elements["confirmarContrasena"]);
        camposAValidar.push(form.elements["terminos"]);

        // Marcar todos como tocados para que muestren errores si están vacíos
        camposAValidar.forEach(input => tocados.add(input.name));
        tocados.add("modalidad");

        // Ejecutar validación general
        let primerErrorInput = null;
        let formularioValido = esModalidadValida;

        camposAValidar.forEach(input => {
            const campoValido = validarCampo(input);
            if (!campoValido) {
                formularioValido = false;
                if (!primerErrorInput) {
                    primerErrorInput = input;
                }
            }
        });

        // Llevar el foco al primer error si existe
        if (!formularioValido) {
            if (primerErrorInput) primerErrorInput.focus();
            return;
        }

        // GENERAR TARJETA DE CONFIRMACIÓN (ÉXITO) CON TEXTCONTENT
        const formData = new FormData(form);
        confirmacionSeccion.innerHTML = ""; // Limpiar cualquier éxito anterior

        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta-exito";

        const tituloExito = document.createElement("h3");
        tituloExito.textContent = "¡Inscripción Exitosa!";
        tarjeta.appendChild(tituloExito);

        const listaDatos = document.createElement("ul");

        // Mapear campos para no renderizar la contraseña ni confirmación
        formData.forEach((value, key) => {
            if (key !== "contrasena" && key !== "confirmarContrasena" && key !== "terminos") {
                const item = document.createElement("li");
                
                // Formatear texto de etiqueta de forma legible
                let labelFormateada = key.charAt(0).toUpperCase() + key.slice(1);
                if(key === "fechaNacimiento") labelFormateada = "Fecha de Nacimiento";
                
                item.textContent = `${labelFormateada}: ${value || "N/A"}`;
                listaDatos.appendChild(item);
            }
        });
        tarjeta.appendChild(listaDatos);
confirmacionSeccion.appendChild(tarjeta);
// Resetear Formulario y estados
form.reset();
tocados.clear();
barraFuerza.style.width = "0%";
contadorComentarios.textContent = "0 / 200";
contadorComentarios.className = "contador";
campoSede.hidden = true;
});
});
