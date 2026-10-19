import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Settings } from "../models/settings.model.js";

const getSettings = asyncHandler(async (req, res) => {
    let settings = await Settings.findOne({})

    // If no settings exist yet, create a default one
    if (!settings) {
        settings = await Settings.create({})
    }

    return res
        .status(200)
        .json(new ApiResponse(200, settings, "Settings fetched successfully"))
})

const updateSettings = asyncHandler(async (req, res) => {
    const { siteName, contactEmail, contactPhone, address, instagram, facebook, whatsapp } = req.body

    let settings = await Settings.findOne({})

    if (!settings) {
        settings = await Settings.create({
            siteName, contactEmail, contactPhone, address, instagram, facebook, whatsapp,
        })
    } else {
        settings.siteName = siteName ?? settings.siteName
        settings.contactEmail = contactEmail ?? settings.contactEmail
        settings.contactPhone = contactPhone ?? settings.contactPhone
        settings.address = address ?? settings.address
        settings.instagram = instagram ?? settings.instagram
        settings.facebook = facebook ?? settings.facebook
        settings.whatsapp = whatsapp ?? settings.whatsapp
        await settings.save()
    }

    return res
        .status(200)
        .json(new ApiResponse(200, settings, "Settings updated successfully"))
})

export { getSettings, updateSettings }