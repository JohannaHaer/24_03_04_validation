import express from "express"
import fs from "fs/promises"
import cors from "cors"
import {v4 as uuid} from "uuid"
import { z } from "zod"
import multer from "multer"


const PORT = 3000
const app = express()
const guestFile = "./guestMessage.json"
const upload = multer({dest: "uploads/"})


const corsOptions = {
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
}

app.use(express.json())
app.use(cors(corsOptions))
// app.use("/uploads", express.static("./uploads"))

const readGuestJson = async () => JSON.parse(await fs.readFile(guestFile, {encoding: "utf-8"}))
const writeGuestJson = (guest) => fs.writeFile(guestFile, JSON.stringify(guest))

try {
    await fs.access(guestFile)
} catch (err) {
    await writeGuestJson([])
}

app.get("/guest", async (req, res) => {
    try {
        const guests = await readGuestJson()
        res.json(guests)
    } catch (err) {
        res.status(500).end()
    }
})

app.post("/guest", upload.none(""), async (req, res) => {
    const guestInputScheme = z.object({
        surename: z.string(),
        lastname: z.string(),
        email: z.string().includes("@"),
        message: z.string().min(10)
    })
    try {
        const parseInput = guestInputScheme.safeParse({
            ...req.body
        })

        if (!parseInput.success) {
            console.error(parseInput.error)
            res.sendStatus(400)
            return
        }

        const newGuest = {
            ...parseInput.data,
            id: uuid()
        }

        const guests = await readGuestJson()
        await writeGuestJson([...guests, newGuest])

        res.status(201).json(newGuest)
    } catch (err) {
        console.error(err);
        res.status(500).end()
    }
})

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
})