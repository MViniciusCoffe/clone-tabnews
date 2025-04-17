function status(request, response) {
  response.status(200).json({ chave: "Hello World" });
}

export default status;