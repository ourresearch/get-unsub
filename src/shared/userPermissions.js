

const roles = ["Admin", "Collaborator", "Viewer", "Unaffiliated"]
const roleDescriptions = {
    // ConsortiumAdmin: "Can view and modify data and users at both consortium and institution level.",
    Admin: "Can view and modify data and users at institution level",
    Collaborator: "Can view and modify data",
    Viewer: "Can view data only",
    Unaffiliated: "No access"
}

const roleFromPermissions = function (permissions) {
    let ret
    if (permissions.includes("admin")) ret = "Admin"
    else if (permissions.includes("modify")) ret = "Collaborator"
    else if (permissions.includes("view")) ret = "Viewer"
    else ret = "Unaffiliated"

    return ret
}


const permissionsFromRole = function (role) {
    let ret = []
    if (role === "ConsortiumAdmin") ret = ["admin", "modify", "view"]
    else if (role === "Admin") ret = ["admin", "modify", "view"]
    else if (role === "Collaborator") ret = ["modify", "view"]
    else if (role === "Viewer") ret = ["view"]

    return ret
}


export {
    roleFromPermissions,
    permissionsFromRole,
    roles,
    roleDescriptions,
}