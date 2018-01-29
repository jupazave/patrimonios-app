function datosAjax(url, tipo, data, error){
	if (!tipo) { tipo = 'GET'; }
	var parametros = {
        url: url,
        type: tipo,
        method: tipo,
        data: data,
        //cache: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Accept', 'application/json');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            errorDeConexion(xhr, ajaxOptions, thrownError);
        }
    };
	return parametros;
}