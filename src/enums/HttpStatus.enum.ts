export enum ApiStatusEnum {

    LOGIN_SUCCESS = "Logeado correctamente",
    LOGIN_FAIL = "Error al iniciar sesión",
    REGISTRATION_FAIL = "Error al registrar el usuario",
    REGISTRATION_SUCCESS = "Registrado correctamente",
    INVALID_CREDENTIALS = "Credenciales invalidas!",
    TEST_ERROR = "Error de prueba, debe ser eliminado en modo produccion!",

    PASSWORD_UPDATE_SUCCESS = "Contraseña actualizada correctamente",
    PASSWORD_UPDATE_FAILED = "Error al actualizar la contraseña",
    PASSWORDS_DONT_MATCH = "Las contraseñas no coinciden",

    USER_DELETED = "Este usuario fue eliminado!",
    USER_DELETION_FAILED = "No se pudo eliminar este usuario",
    USER_RESTORED = "Usuario restaurado correctamente",
    USER_NOT_FOUND = "Usuario no encontrado",
    USER_UPDATE_FAILED = "Error al actualizar el usuario",
    USER_LIST_EMPTY = "La lista de usuarios está vacia",
    USER_UNBAN_OR_BAN = "No se pudo actualizar el estado baneado de este usuario",
    USER_RANKUP_FAILED = "No se pudo actualizar el rango de este usuario",

    RANKING_UP_FAIL = "Error al mejorar el rango del usuario",
    RANKING_UP_SUCCESS = "El rol de este usuario ha cambiado",

    UNKNOWN_ERROR = "Algo salió mal",
    RESOURCE_NOT_FOUND = "Recurso no encontrado",
    UNAUTHORIZED = "Acceso denegado",
    NOTHING_UPDATED = "No se ha hecho ninguna actualizacion",

    TOKEN_EXPIRED = "La sesion ha expirado!",
    TOKEN_NOT_FOUND = "No se encontró ningún token en esta solicitud",
    INSUFFICIENT_PERMISSIONS = "No tienes permisos para hacer eso",
    NOT_ALLOWED_HERE = "No estás permitido aqui!",
    MAIL_IN_USE = "Este correo ya esta registrado!",

    HASHING_FAILED = "Encriptado de contraseña fallido!",

    REVIEW_CREATION_FAILED = "No se pudo crear una nueva reseña",
    REVIEW_DELETION_FAILED = "No se pudo eliminar esta reseña",
    REVIEW_DELETION_SUCCESS = "Reseña eliminada correctamente",
    REVIEWS_NOT_IN_CENTER = "No hay reseñas para este complejo!",

    RESERVATION_NOT_FOUND = "No se encontró ninguna reseña",

    RATING_OUT_OF_BOUNDS = "Rating fuera de limites",
    CENTER_LIST_EMTPY = "No se encontraron centros deportivos",
    CENTER_CREATION_FAILED = "Creacion de  centro deportivo fallida",
    CENTER_NOT_FOUND = "No se pudo encontra este centro deportivo",
    CENTER_DELETION_SUCCESS = "Centro deportivo eliminado correctamente",
    CENTER_DELETION_FAILED = "No se pudo eliminar este centro deportivo",
    CENTER_ALREADY_HAS_STATE = "Este centro ya está en modo",
    CENTER_WRONG_OWNER = "La cuenta asociada con este centro deportivo no coincide",

    IMAGE_CREATION_FAILED = "No se pudo crear una nueva imagen",
    IMAGE_INSERTION_FAIL = "No se pudo insertar",
    IMAGE_TOCENTER_UPLOAD_SUCCESS = "Imagenes insertadas en el centro deportivo correctamente",
    IMAGE_TOCENTER_UPLOAD_FAILED = "No se pudo insertar la imagen al centro deportivo",
    IMAGE_TO_FIELD_UPLOAD_SUCCESS = "Imagen insertada en la cancha correctamente",
    NO_IMAGES_IN_REQUEST = "No se encontraron imagenes en esta peticion!",
    IMAGE_PROFILE_UPLOAD_FAILED = "No se pudo subir la imagen de perfil!",
    IMAGE_PROFILE_UPLOAD_SUCCESS = "Imagen de perfil subida correctamente",
    IMAGE_DELETION_FAILED = "No se pudo eliminar esta imagen!",
    IMAGE_NOT_FOUND = "No se pudo encontrar esta imagen!",
    IMAGE_DELETION_SUCCESS = "Imagen eliminada correctamente",
    MAX_IMAGES_REACHED= "Maximo de imagenes alcanzado, elimina una imagen antes de subir otra!",


    FIELD_ALREADY_HAS_A_REVIEW = "Esta cancha ya tiene una reseña!"

}