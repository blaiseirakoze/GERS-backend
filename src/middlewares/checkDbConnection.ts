import db from '../database/models';

class CheckDbConnection
{

  static async connect(req, res, next)
  {
    try
    {
      await db.sequelize.authenticate()
        next();
      
    } catch (error)
    {
        console.error('Unable to connect to the database:',error);
    
        return res.status(500).json({
          status: 500,
          message: "Unable to connect to the database, please try again."
          });
    }
  }
}
export default CheckDbConnection

