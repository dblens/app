import { Client } from "pg";
import { Request, Response } from "express";
import { getPgConnection } from ".";
import OpenAI from "openai";

export const getAiSuggestionHandler = async (req: Request, res: Response) => {
  const { systemInstructions, query, error } = req.body;
  if (!systemInstructions || !query || !error) {
    const missingParams = [];
    if (!systemInstructions) missingParams.push("systemInstructions");
    if (!query) missingParams.push("query");
    if (!error) missingParams.push("error");
    res.status(400).json({
      message: `Missing required parameters: ${missingParams.join(", ")}`,
    });
  }
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            'System Instructions\n\nYou are a Database Expert Engine  and helping engineers to fix their database queries. You provide JSON outputs instead of text, generating SQL fixes in the following format so that solutions can parse the JSON directly and parse it \n\n{\n"SQL": "new SQL",\n"reason":"reason"\n}\n\nHere are the list of all Postgres DB objects\n\nobject_type,object_name,table_name,object_detail\ncolumn,public,Album,ArtistId integer\ncolumn,public,Album,Title character varying(160)\ncolumn,public,Album,AlbumId integer\ncolumn,public,Artist,ArtistId integer\ncolumn,public,Artist,Name character varying(120)\ncolumn,public,Customer,LastName character varying(20)\ncolumn,public,Customer,Phone character varying(24)\ncolumn,public,Customer,State character varying(40)\ncolumn,public,Customer,Country character varying(40)\ncolumn,public,Customer,CustomerId integer\ncolumn,public,Customer,Company character varying(80)\ncolumn,public,Customer,FirstName character varying(40)\ncolumn,public,Customer,SupportRepId integer\ncolumn,public,Customer,Email character varying(60)\ncolumn,public,Customer,Address character varying(70)\ncolumn,public,Customer,City character varying(40)\ncolumn,public,Customer,PostalCode character varying(10)\ncolumn,public,Customer,Fax character varying(24)\ncolumn,public,Employee,Address character varying(70)\ncolumn,public,Employee,BirthDate timestamp without time zone\ncolumn,public,Employee,Title character varying(30)\ncolumn,public,Employee,EmployeeId integer\ncolumn,public,Employee,Fax character varying(24)\ncolumn,public,Employee,FirstName character varying(20)\ncolumn,public,Employee,Phone character varying(24)\ncolumn,public,Employee,HireDate timestamp without time zone\ncolumn,public,Employee,ReportsTo integer\ncolumn,public,Employee,Email character varying(60)\ncolumn,public,Employee,State character varying(40)\ncolumn,public,Employee,PostalCode character varying(10)\ncolumn,public,Employee,LastName character varying(20)\ncolumn,public,Employee,City character varying(40)\ncolumn,public,Employee,Country character varying(40)\ncolumn,public,Genre,GenreId integer\ncolumn,public,Genre,Name character varying(120)\ncolumn,public,Invoice,BillingState character varying(40)\ncolumn,public,Invoice,BillingCity character varying(40)\ncolumn,public,Invoice,CustomerId integer\ncolumn,public,Invoice,InvoiceDate timestamp without time zone\ncolumn,public,Invoice,Total numeric\ncolumn,public,Invoice,BillingCountry character varying(40)\ncolumn,public,Invoice,BillingAddress character varying(70)\ncolumn,public,Invoice,InvoiceId integer\ncolumn,public,Invoice,BillingPostalCode character varying(10)\ncolumn,public,InvoiceLine,TrackId integer\ncolumn,public,InvoiceLine,Quantity integer\ncolumn,public,InvoiceLine,UnitPrice numeric\ncolumn,public,InvoiceLine,InvoiceId integer\ncolumn,public,InvoiceLine,InvoiceLineId integer\ncolumn,public,MediaType,Name character varying(120)\ncolumn,public,MediaType,MediaTypeId integer\ncolumn,public,Playlist,Name character varying(120)\ncolumn,public,Playlist,PlaylistId integer\ncolumn,public,PlaylistTrack,TrackId integer\ncolumn,public,PlaylistTrack,PlaylistId integer\ncolumn,public,Track,GenreId integer\ncolumn,public,Track,Name character varying(200)\ncolumn,public,Track,Bytes integer\ncolumn,public,Track,Composer character varying(220)\ncolumn,public,Track,TrackId integer\ncolumn,public,Track,UnitPrice numeric\ncolumn,public,Track,Milliseconds integer\ncolumn,public,Track,MediaTypeId integer\ncolumn,public,Track,AlbumId integer\nschema,public,,\ntable,public,Album,\ntable,public,Artist,\ntable,public,Customer,\ntable,public,Employee,\ntable,public,Genre,\ntable,public,Invoice,\ntable,public,InvoiceLine,\ntable,public,MediaType,\ntable,public,Playlist,\ntable,public,PlaylistTrack,\ntable,public,Track,\n\n',
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: '\n# Query\nSELECT nows();\n\n# Error\n\n{\n  "length": 198,\n  "name": "error",\n  "severity": "ERROR",\n  "code": "42883",\n  "hint": "No function matches the given name and argument types. You might need to add explicit type casts.",\n  "position": "8",\n  "file": "parse_func.c",\n  "line": "629",\n  "routine": "ParseFuncOrColumn"\n}\n',
            },
          ],
        },
      ],
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    try {
      if (
        response &&
        response &&
        response.choices &&
        response.choices[0] &&
        response.choices[0].message &&
        response.choices[0].message.content
      ) {
        const result = JSON.parse(response.choices[0].message.content);
        return res.status(200).json(result);
      }
      throw new Error("No response from AI");
    } catch (error) {
      console.error("Error parsing response:", error);
      res.status(500).json({
        message: "Error parsing response",
        error,
      });
    }
  } catch (error: any) {
    console.error("Error executing queries:", error);
    res
      .status(500)
      .json({ message: "Error executing queries", error: error?.message });
  }
};
